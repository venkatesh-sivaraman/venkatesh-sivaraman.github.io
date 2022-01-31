
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.3' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    }

    /* src/About.svelte generated by Svelte v3.46.3 */

    const file$4 = "src/About.svelte";

    function create_fragment$4(ctx) {
    	let h1;
    	let t1;
    	let p;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Venkatesh Sivaraman";
    			t1 = space();
    			p = element("p");
    			p.textContent = "This is Venkatesh Sivaraman's personal website.";
    			attr_dev(h1, "class", "mt2");
    			add_location(h1, file$4, 0, 0, 0);
    			add_location(p, file$4, 1, 0, 41);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/Experience.svelte generated by Svelte v3.46.3 */

    const file$3 = "src/Experience.svelte";

    function create_fragment$3(ctx) {
    	let h1;
    	let t0;
    	let span;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text("Venkatesh Sivaraman ");
    			span = element("span");
    			span.textContent = "Experience";
    			attr_dev(span, "class", "fw2");
    			add_location(span, file$3, 1, 22, 39);
    			attr_dev(h1, "class", "mt2");
    			add_location(h1, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			append_dev(h1, span);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Experience', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Experience> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Experience extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Experience",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/Projects.svelte generated by Svelte v3.46.3 */

    const file$2 = "src/Projects.svelte";

    function create_fragment$2(ctx) {
    	let h1;
    	let t0;
    	let span;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text("Venkatesh Sivaraman ");
    			span = element("span");
    			span.textContent = "Projects";
    			attr_dev(span, "class", "fw2");
    			add_location(span, file$2, 1, 22, 39);
    			attr_dev(h1, "class", "mt2");
    			add_location(h1, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			append_dev(h1, span);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Projects', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Projects> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Projects extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Projects",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Publications.svelte generated by Svelte v3.46.3 */

    const file$1 = "src/Publications.svelte";

    function create_fragment$1(ctx) {
    	let h1;
    	let t0;
    	let span;
    	let t2;
    	let section;
    	let h20;
    	let t4;
    	let p0;
    	let strong0;
    	let t6;
    	let em0;
    	let t8;
    	let p1;
    	let t9;
    	let strong1;
    	let t11;
    	let em1;
    	let t13;
    	let p2;
    	let t14;
    	let strong2;
    	let t16;
    	let em2;
    	let t18;
    	let h21;
    	let t20;
    	let p3;
    	let t21;
    	let strong3;
    	let t23;
    	let em3;
    	let t25;
    	let p4;
    	let t26;
    	let strong4;
    	let t28;
    	let em4;
    	let t30;
    	let p5;
    	let t31;
    	let strong5;
    	let t33;
    	let em5;
    	let t35;
    	let h22;
    	let t37;
    	let p6;
    	let strong6;
    	let t39;
    	let em6;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text("Venkatesh Sivaraman ");
    			span = element("span");
    			span.textContent = "Publications";
    			t2 = space();
    			section = element("section");
    			h20 = element("h2");
    			h20.textContent = "2022";
    			t4 = space();
    			p0 = element("p");
    			strong0 = element("strong");
    			strong0.textContent = "Sivaraman, V.";
    			t6 = text(", Wu, Y., & Perer, A. (2022). Emblaze:\n    Illuminating machine learning representations through interactive comparison\n    of embedding spaces. ");
    			em0 = element("em");
    			em0.textContent = "To appear at ACM IUI 2022.";
    			t8 = space();
    			p1 = element("p");
    			t9 = text("Kawakami, A., ");
    			strong1 = element("strong");
    			strong1.textContent = "Sivaraman, V.";
    			t11 = text(", Cheng, H., Stapleton, L.,\n    Cheng, Y., Qing, D., Perer, A., Wu, S., Zhu, H., & Holstein, K. (2022).\n    Improving human-AI partnerships in child welfare: Understanding worker\n    practices, challenges, and desires for algorithmic decision support.\n    ");
    			em1 = element("em");
    			em1.textContent = "To appear at ACM CHI 2022.";
    			t13 = space();
    			p2 = element("p");
    			t14 = text("Cheng, H., Stapleton, L., Kawakami, A., ");
    			strong2 = element("strong");
    			strong2.textContent = "Sivaraman, V.";
    			t16 = text(",\n    Cheng, Y., Qing, D., Perer, A., Holstein, K., Wu, S., & Zhu, H. (2022). How\n    child welfare workers reduce racial disparities in algorithmic decisions.\n    ");
    			em2 = element("em");
    			em2.textContent = "To appear at ACM CHI 2022.";
    			t18 = space();
    			h21 = element("h2");
    			h21.textContent = "2021";
    			t20 = space();
    			p3 = element("p");
    			t21 = text("Wu, J., ");
    			strong3 = element("strong");
    			strong3.textContent = "Sivaraman, V.";
    			t23 = text(", Kumar, D. (first three authors equal\n    contribution), Banda, J. M., & Sontag, D. (2021). Pulse of the pandemic:\n    Iterative topic filtering for clinical information extraction from social\n    media. ");
    			em3 = element("em");
    			em3.textContent = "Journal of Biomedical Informatics.";
    			t25 = space();
    			p4 = element("p");
    			t26 = text("Newman-Griffis, D., ");
    			strong4 = element("strong");
    			strong4.textContent = "Sivaraman, V.";
    			t28 = text(", Perer, A.,\n    Fosler-Lussier, E., & Hochheiser, H. (2021). TextEssence: A Tool for\n    Interactive Analysis of Semantic Shifts Between Corpora.\n    ");
    			em4 = element("em");
    			em4.textContent = "NAACL Systems Demonstration.";
    			t30 = space();
    			p5 = element("p");
    			t31 = text("Hwang, T., Parker, S. S., Hill, S. M., Ilunga, M. W., Grant, R. A.,\n    ");
    			strong5 = element("strong");
    			strong5.textContent = "Sivaraman, V.";
    			t33 = text(", Mouneimne, G., & Keating, A. E. (2021). A\n    proteome-wide screen uncovers diverse roles for sequence context surrounding\n    proline-rich motifs in Ena/VASP molecular recognition.\n    ");
    			em5 = element("em");
    			em5.textContent = "Under review.";
    			t35 = space();
    			h22 = element("h2");
    			h22.textContent = "Older";
    			t37 = space();
    			p6 = element("p");
    			strong6 = element("strong");
    			strong6.textContent = "Sivaraman, V.";
    			t39 = text(", Yoon, D., & Mitros, P. (2016). Simplified\n    audio production in asynchronous voice-based discussions.\n    ");
    			em6 = element("em");
    			em6.textContent = "ACM CHI 2016.";
    			attr_dev(span, "class", "fw2");
    			add_location(span, file$1, 1, 22, 39);
    			attr_dev(h1, "class", "mt2");
    			add_location(h1, file$1, 0, 0, 0);
    			add_location(h20, file$1, 5, 2, 112);
    			add_location(strong0, file$1, 7, 4, 136);
    			add_location(em0, file$1, 9, 25, 311);
    			add_location(p0, file$1, 6, 2, 128);
    			add_location(strong1, file$1, 12, 18, 378);
    			add_location(em1, file$1, 16, 4, 664);
    			add_location(p1, file$1, 11, 2, 356);
    			add_location(strong2, file$1, 19, 44, 757);
    			add_location(em2, file$1, 22, 4, 951);
    			add_location(p2, file$1, 18, 2, 709);
    			add_location(h21, file$1, 24, 2, 996);
    			add_location(strong3, file$1, 26, 12, 1028);
    			add_location(em3, file$1, 29, 11, 1263);
    			add_location(p3, file$1, 25, 2, 1012);
    			add_location(strong4, file$1, 32, 24, 1344);
    			add_location(em4, file$1, 35, 4, 1525);
    			add_location(p4, file$1, 31, 2, 1316);
    			add_location(strong5, file$1, 39, 4, 1654);
    			add_location(em5, file$1, 42, 4, 1872);
    			add_location(p5, file$1, 37, 2, 1574);
    			add_location(h22, file$1, 44, 2, 1904);
    			add_location(strong6, file$1, 46, 4, 1929);
    			add_location(em6, file$1, 48, 4, 2069);
    			add_location(p6, file$1, 45, 2, 1921);
    			attr_dev(section, "class", "lh-copy");
    			add_location(section, file$1, 4, 0, 84);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			append_dev(h1, span);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, section, anchor);
    			append_dev(section, h20);
    			append_dev(section, t4);
    			append_dev(section, p0);
    			append_dev(p0, strong0);
    			append_dev(p0, t6);
    			append_dev(p0, em0);
    			append_dev(section, t8);
    			append_dev(section, p1);
    			append_dev(p1, t9);
    			append_dev(p1, strong1);
    			append_dev(p1, t11);
    			append_dev(p1, em1);
    			append_dev(section, t13);
    			append_dev(section, p2);
    			append_dev(p2, t14);
    			append_dev(p2, strong2);
    			append_dev(p2, t16);
    			append_dev(p2, em2);
    			append_dev(section, t18);
    			append_dev(section, h21);
    			append_dev(section, t20);
    			append_dev(section, p3);
    			append_dev(p3, t21);
    			append_dev(p3, strong3);
    			append_dev(p3, t23);
    			append_dev(p3, em3);
    			append_dev(section, t25);
    			append_dev(section, p4);
    			append_dev(p4, t26);
    			append_dev(p4, strong4);
    			append_dev(p4, t28);
    			append_dev(p4, em4);
    			append_dev(section, t30);
    			append_dev(section, p5);
    			append_dev(p5, t31);
    			append_dev(p5, strong5);
    			append_dev(p5, t33);
    			append_dev(p5, em5);
    			append_dev(section, t35);
    			append_dev(section, h22);
    			append_dev(section, t37);
    			append_dev(section, p6);
    			append_dev(p6, strong6);
    			append_dev(p6, t39);
    			append_dev(p6, em6);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Publications', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Publications> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Publications extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Publications",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    function statefulSwap(initialState) {
      const { subscribe, set, update } = writable(initialState);

      let curr = initialState;
      subscribe((val) => (curr = val));

      let nextState = null;

      function transitionTo(newState) {
        if (nextState === newState) return;
        nextState = newState;
        set(null);
      }

      function onOutro() {
        set(nextState);
      }

      return {
        subscribe,
        onOutro,
        set(val) {
          if (val != curr) transitionTo(val);
        },
        update(func) {
          transitionTo(func(curr));
        },
      };
    }

    /* src/App.svelte generated by Svelte v3.46.3 */

    const { console: console_1 } = globals;
    const file = "src/App.svelte";

    // (102:29) 
    function create_if_block_3(ctx) {
    	let div;
    	let experience;
    	let t0;
    	let footer;
    	let div_intro;
    	let div_outro;
    	let current;
    	let mounted;
    	let dispose;
    	experience = new Experience({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(experience.$$.fragment);
    			t0 = space();
    			footer = element("footer");
    			footer.textContent = "Copyright 2022 Venkatesh Sivaraman.";
    			attr_dev(footer, "class", "gray");
    			add_location(footer, file, 109, 6, 2845);
    			attr_dev(div, "class", "document svelte-1lmf6vn");
    			add_location(div, file, 102, 4, 2652);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(experience, div, null);
    			append_dev(div, t0);
    			append_dev(div, footer);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "outroend", /*visibleTab*/ ctx[3].onOutro, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(experience.$$.fragment, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, /*fadeAndSlide*/ ctx[4], { above: 3 < /*oldTab*/ ctx[2] });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(experience.$$.fragment, local);
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, /*fadeAndSlide*/ ctx[4], { above: /*newTab*/ ctx[0] > 3 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(experience);
    			if (detaching && div_outro) div_outro.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(102:29) ",
    		ctx
    	});

    	return block;
    }

    // (92:29) 
    function create_if_block_2(ctx) {
    	let div;
    	let publications;
    	let t0;
    	let footer;
    	let div_intro;
    	let div_outro;
    	let current;
    	let mounted;
    	let dispose;
    	publications = new Publications({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(publications.$$.fragment);
    			t0 = space();
    			footer = element("footer");
    			footer.textContent = "Copyright 2022 Venkatesh Sivaraman.";
    			attr_dev(footer, "class", "gray");
    			add_location(footer, file, 99, 6, 2541);
    			attr_dev(div, "class", "document svelte-1lmf6vn");
    			add_location(div, file, 92, 4, 2346);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(publications, div, null);
    			append_dev(div, t0);
    			append_dev(div, footer);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "outroend", /*visibleTab*/ ctx[3].onOutro, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(publications.$$.fragment, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, /*fadeAndSlide*/ ctx[4], { above: 2 < /*oldTab*/ ctx[2] });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(publications.$$.fragment, local);
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, /*fadeAndSlide*/ ctx[4], { above: /*newTab*/ ctx[0] > 2 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(publications);
    			if (detaching && div_outro) div_outro.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(92:29) ",
    		ctx
    	});

    	return block;
    }

    // (82:29) 
    function create_if_block_1(ctx) {
    	let div;
    	let projects;
    	let t0;
    	let footer;
    	let div_intro;
    	let div_outro;
    	let current;
    	let mounted;
    	let dispose;
    	projects = new Projects({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(projects.$$.fragment);
    			t0 = space();
    			footer = element("footer");
    			footer.textContent = "Copyright 2022 Venkatesh Sivaraman.";
    			attr_dev(footer, "class", "gray");
    			add_location(footer, file, 89, 6, 2235);
    			attr_dev(div, "class", "document svelte-1lmf6vn");
    			add_location(div, file, 82, 4, 2044);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(projects, div, null);
    			append_dev(div, t0);
    			append_dev(div, footer);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "outroend", /*visibleTab*/ ctx[3].onOutro, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(projects.$$.fragment, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, /*fadeAndSlide*/ ctx[4], { above: 1 < /*oldTab*/ ctx[2] });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(projects.$$.fragment, local);
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, /*fadeAndSlide*/ ctx[4], { above: /*newTab*/ ctx[0] > 1 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(projects);
    			if (detaching && div_outro) div_outro.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(82:29) ",
    		ctx
    	});

    	return block;
    }

    // (72:2) {#if $visibleTab == 0}
    function create_if_block(ctx) {
    	let div;
    	let about;
    	let t0;
    	let footer;
    	let div_intro;
    	let div_outro;
    	let current;
    	let mounted;
    	let dispose;
    	about = new About({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(about.$$.fragment);
    			t0 = space();
    			footer = element("footer");
    			footer.textContent = "Copyright 2022 Venkatesh Sivaraman.";
    			attr_dev(footer, "class", "gray");
    			add_location(footer, file, 79, 6, 1933);
    			attr_dev(div, "class", "document svelte-1lmf6vn");
    			add_location(div, file, 72, 4, 1745);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(about, div, null);
    			append_dev(div, t0);
    			append_dev(div, footer);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "outroend", /*visibleTab*/ ctx[3].onOutro, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(about.$$.fragment, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, /*fadeAndSlide*/ ctx[4], { above: 0 < /*oldTab*/ ctx[2] });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(about.$$.fragment, local);
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, /*fadeAndSlide*/ ctx[4], { above: /*newTab*/ ctx[0] > 0 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(about);
    			if (detaching && div_outro) div_outro.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(72:2) {#if $visibleTab == 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let aside;
    	let ul;
    	let li0;
    	let a0;
    	let t1;
    	let li1;
    	let a1;
    	let t3;
    	let li2;
    	let a2;
    	let t5;
    	let li3;
    	let a3;
    	let t7;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block, create_if_block_1, create_if_block_2, create_if_block_3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$visibleTab*/ ctx[1] == 0) return 0;
    		if (/*$visibleTab*/ ctx[1] == 1) return 1;
    		if (/*$visibleTab*/ ctx[1] == 2) return 2;
    		if (/*$visibleTab*/ ctx[1] == 3) return 3;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			aside = element("aside");
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "About";
    			t1 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Projects";
    			t3 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Publications";
    			t5 = space();
    			li3 = element("li");
    			a3 = element("a");
    			a3.textContent = "Experience";
    			t7 = space();
    			if (if_block) if_block.c();
    			attr_dev(a0, "class", "svelte-1lmf6vn");
    			toggle_class(a0, "active-link", /*$visibleTab*/ ctx[1] == 0);
    			toggle_class(a0, "link", /*$visibleTab*/ ctx[1] != 0);
    			add_location(a0, file, 42, 8, 979);
    			attr_dev(li0, "class", "svelte-1lmf6vn");
    			add_location(li0, file, 41, 6, 966);
    			attr_dev(a1, "class", "svelte-1lmf6vn");
    			toggle_class(a1, "active-link", /*$visibleTab*/ ctx[1] == 1);
    			toggle_class(a1, "link", /*$visibleTab*/ ctx[1] != 1);
    			add_location(a1, file, 49, 8, 1159);
    			attr_dev(li1, "class", "svelte-1lmf6vn");
    			add_location(li1, file, 48, 6, 1146);
    			attr_dev(a2, "class", "svelte-1lmf6vn");
    			toggle_class(a2, "active-link", /*$visibleTab*/ ctx[1] == 2);
    			toggle_class(a2, "link", /*$visibleTab*/ ctx[1] != 2);
    			add_location(a2, file, 56, 8, 1342);
    			attr_dev(li2, "class", "svelte-1lmf6vn");
    			add_location(li2, file, 55, 6, 1329);
    			attr_dev(a3, "class", "svelte-1lmf6vn");
    			toggle_class(a3, "active-link", /*$visibleTab*/ ctx[1] == 3);
    			toggle_class(a3, "link", /*$visibleTab*/ ctx[1] != 3);
    			add_location(a3, file, 63, 8, 1529);
    			attr_dev(li3, "class", "svelte-1lmf6vn");
    			add_location(li3, file, 62, 6, 1516);
    			attr_dev(ul, "class", "list pl0 svelte-1lmf6vn");
    			add_location(ul, file, 40, 4, 938);
    			attr_dev(aside, "class", "svelte-1lmf6vn");
    			add_location(aside, file, 39, 2, 926);
    			attr_dev(main, "class", "sans-serif svelte-1lmf6vn");
    			add_location(main, file, 38, 0, 898);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, aside);
    			append_dev(aside, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(ul, t3);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(ul, t5);
    			append_dev(ul, li3);
    			append_dev(li3, a3);
    			append_dev(main, t7);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(main, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a0, "click", /*click_handler*/ ctx[6], false, false, false),
    					listen_dev(a1, "click", /*click_handler_1*/ ctx[7], false, false, false),
    					listen_dev(a2, "click", /*click_handler_2*/ ctx[8], false, false, false),
    					listen_dev(a3, "click", /*click_handler_3*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$visibleTab*/ 2) {
    				toggle_class(a0, "active-link", /*$visibleTab*/ ctx[1] == 0);
    			}

    			if (dirty & /*$visibleTab*/ 2) {
    				toggle_class(a0, "link", /*$visibleTab*/ ctx[1] != 0);
    			}

    			if (dirty & /*$visibleTab*/ 2) {
    				toggle_class(a1, "active-link", /*$visibleTab*/ ctx[1] == 1);
    			}

    			if (dirty & /*$visibleTab*/ 2) {
    				toggle_class(a1, "link", /*$visibleTab*/ ctx[1] != 1);
    			}

    			if (dirty & /*$visibleTab*/ 2) {
    				toggle_class(a2, "active-link", /*$visibleTab*/ ctx[1] == 2);
    			}

    			if (dirty & /*$visibleTab*/ 2) {
    				toggle_class(a2, "link", /*$visibleTab*/ ctx[1] != 2);
    			}

    			if (dirty & /*$visibleTab*/ 2) {
    				toggle_class(a3, "active-link", /*$visibleTab*/ ctx[1] == 3);
    			}

    			if (dirty & /*$visibleTab*/ 2) {
    				toggle_class(a3, "link", /*$visibleTab*/ ctx[1] != 3);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(main, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const AnimationDuration = 500;

    function instance($$self, $$props, $$invalidate) {
    	let $visibleTab;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { name } = $$props;
    	const visibleTab = statefulSwap(0);
    	validate_store(visibleTab, 'visibleTab');
    	component_subscribe($$self, visibleTab, value => $$invalidate(1, $visibleTab = value));
    	let oldTab = 0;
    	let newTab = 0;

    	function fadeAndSlide(node, { duration = AnimationDuration, above = 1, amount = 100 }) {
    		return {
    			duration,
    			css: t => {
    				const eased = cubicInOut(t);

    				return `
					transform: translateY(${(amount - eased * amount) * (above ? -1 : 1)}px);
					opacity: ${eased};`;
    			}
    		};
    	}

    	const writable_props = ['name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, newTab = 0);
    	const click_handler_1 = () => $$invalidate(0, newTab = 1);
    	const click_handler_2 = () => $$invalidate(0, newTab = 2);
    	const click_handler_3 = () => $$invalidate(0, newTab = 3);

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(5, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({
    		cubicInOut,
    		About,
    		Experience,
    		Projects,
    		Publications,
    		statefulSwap,
    		name,
    		visibleTab,
    		oldTab,
    		newTab,
    		AnimationDuration,
    		fadeAndSlide,
    		$visibleTab
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(5, name = $$props.name);
    		if ('oldTab' in $$props) $$invalidate(2, oldTab = $$props.oldTab);
    		if ('newTab' in $$props) $$invalidate(0, newTab = $$props.newTab);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$visibleTab, newTab*/ 3) {
    			if ($visibleTab != newTab && $visibleTab != null) {
    				console.log($visibleTab, newTab);
    				$$invalidate(2, oldTab = $visibleTab);
    				set_store_value(visibleTab, $visibleTab = newTab, $visibleTab);
    			}
    		}
    	};

    	return [
    		newTab,
    		$visibleTab,
    		oldTab,
    		visibleTab,
    		fadeAndSlide,
    		name,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { name: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[5] === undefined && !('name' in props)) {
    			console_1.warn("<App> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
