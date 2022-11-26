
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
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
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
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
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
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
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
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
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
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
    const file$7 = "src/About.svelte";

    function create_fragment$7(ctx) {
    	let h1;
    	let t1;
    	let p0;
    	let t2;
    	let a0;
    	let t4;
    	let a1;
    	let t6;
    	let span0;
    	let t8;
    	let span1;
    	let t10;
    	let span2;
    	let t12;
    	let span3;
    	let t14;
    	let t15;
    	let p1;
    	let t16;
    	let a2;
    	let t18;
    	let t19;
    	let div2;
    	let a3;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t20;
    	let p2;
    	let span4;
    	let t22;
    	let span5;
    	let t24;
    	let a4;
    	let div1;
    	let img1;
    	let img1_src_value;
    	let t25;
    	let p3;
    	let span6;
    	let t27;
    	let span7;
    	let t29;
    	let p4;
    	let t30;
    	let a5;
    	let t32;
    	let t33;
    	let p5;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Venkatesh Sivaraman";
    			t1 = space();
    			p0 = element("p");
    			t2 = text("Hi! 👋🏾 I'm Venkat, a PhD student at the Carnegie Mellon University ");
    			a0 = element("a");
    			a0.textContent = "Human-Computer Interaction Institute";
    			t4 = text(". Advised by\n  ");
    			a1 = element("a");
    			a1.textContent = "Adam Perer";
    			t6 = text(", I study\n  ");
    			span0 = element("span");
    			span0.textContent = "how people use artificial intelligence (AI) to guide their decision-making";
    			t8 = text(", and use that knowledge to\n  ");
    			span1 = element("span");
    			span1.textContent = "build better ways to communicate AI predictions";
    			t10 = text(". I'm\n  particularly interested in high-stakes decision making domains such as\n  ");
    			span2 = element("span");
    			span2.textContent = "child welfare";
    			t12 = text("\n  and ");
    			span3 = element("span");
    			span3.textContent = "health care";
    			t14 = text(", where an understanding of\n  algorithms' strengths and limitations is crucial to helping improve people's\n  lives.");
    			t15 = space();
    			p1 = element("p");
    			t16 = text("I have recently been focused on tools for model developers and intensive care\n  clinicians (");
    			a2 = element("a");
    			a2.textContent = "see more projects";
    			t18 = text("):");
    			t19 = space();
    			div2 = element("div");
    			a3 = element("a");
    			div0 = element("div");
    			img0 = element("img");
    			t20 = space();
    			p2 = element("p");
    			span4 = element("span");
    			span4.textContent = "AI Clinician Explorer:";
    			t22 = space();
    			span5 = element("span");
    			span5.textContent = "Patient Trajectory Visualization";
    			t24 = space();
    			a4 = element("a");
    			div1 = element("div");
    			img1 = element("img");
    			t25 = space();
    			p3 = element("p");
    			span6 = element("span");
    			span6.textContent = "Emblaze:";
    			t27 = space();
    			span7 = element("span");
    			span7.textContent = "Interactive Embedding Comparison";
    			t29 = space();
    			p4 = element("p");
    			t30 = text("For more information, please see my ");
    			a5 = element("a");
    			a5.textContent = "CV";
    			t32 = text(".");
    			t33 = space();
    			p5 = element("p");
    			p5.textContent = "I would love to chat about research and collaboration opportunities! Contact\n  me at venkats [at] cmu [dot] edu.";
    			attr_dev(h1, "class", "mt2");
    			add_location(h1, file$7, 6, 0, 115);
    			attr_dev(a0, "class", "link blue dim");
    			attr_dev(a0, "href", "https://hcii.cmu.edu");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$7, 8, 71, 263);
    			attr_dev(a1, "class", "link blue dim");
    			attr_dev(a1, "href", "https://perer.org");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$7, 13, 2, 402);
    			attr_dev(span0, "class", "fw6");
    			add_location(span0, file$7, 16, 2, 502);
    			attr_dev(span1, "class", "fw6");
    			add_location(span1, file$7, 19, 2, 639);
    			attr_dev(span2, "class", "fw6");
    			add_location(span2, file$7, 21, 2, 792);
    			attr_dev(span3, "class", "fw6");
    			add_location(span3, file$7, 22, 6, 837);
    			attr_dev(p0, "class", "lh-copy f3 measure-wide");
    			add_location(p0, file$7, 7, 0, 156);
    			attr_dev(a2, "class", "link blue");
    			attr_dev(a2, "href", "#");
    			add_location(a2, file$7, 28, 14, 1124);
    			attr_dev(p1, "class", "lh-copy f4 measure-wide");
    			add_location(p1, file$7, 26, 0, 994);
    			if (!src_url_equal(img0.src, img0_src_value = "assets/ai-clinician.gif")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Screenshot of AI Clinician Explorer showing charts of patient vitals and labs that dynamically update as the user drags a slider to navigate through the patient's trajectory.");
    			attr_dev(img0, "class", "svelte-x7che0");
    			add_location(img0, file$7, 43, 6, 1488);
    			attr_dev(span4, "class", "b");
    			add_location(span4, file$7, 48, 8, 1758);
    			attr_dev(span5, "class", "fw3");
    			add_location(span5, file$7, 49, 8, 1812);
    			attr_dev(p2, "class", "f5");
    			add_location(p2, file$7, 47, 6, 1735);
    			attr_dev(div0, "class", "project-preview flex flex-column bg-animate hover-bg-near-white pa2 svelte-x7che0");
    			add_location(div0, file$7, 40, 4, 1389);
    			attr_dev(a3, "class", "link black mr2 svelte-x7che0");
    			attr_dev(a3, "href", "https://github.com/cmudig/ai-clinician-explorer");
    			attr_dev(a3, "target", "_blank");
    			add_location(a3, file$7, 35, 2, 1272);
    			if (!src_url_equal(img1.src, img1_src_value = "assets/emblaze.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "A screenshot of Emblaze.");
    			attr_dev(img1, "class", "svelte-x7che0");
    			add_location(img1, file$7, 57, 6, 2082);
    			attr_dev(span6, "class", "b");
    			add_location(span6, file$7, 59, 8, 2175);
    			attr_dev(span7, "class", "fw3");
    			add_location(span7, file$7, 60, 8, 2215);
    			attr_dev(p3, "class", "f5");
    			add_location(p3, file$7, 58, 6, 2152);
    			attr_dev(div1, "class", "project-preview flex flex-column bg-animate hover-bg-near-white pa2 svelte-x7che0");
    			add_location(div1, file$7, 54, 4, 1983);
    			attr_dev(a4, "class", "link black mr2 svelte-x7che0");
    			attr_dev(a4, "href", "https://bit.ly/emblaze-demo");
    			attr_dev(a4, "target", "_blank");
    			add_location(a4, file$7, 53, 2, 1901);
    			attr_dev(div2, "class", "project-preview-row svelte-x7che0");
    			add_location(div2, file$7, 34, 0, 1236);
    			attr_dev(a5, "class", "link blue");
    			attr_dev(a5, "href", "/assets/venkats_cv.pdf");
    			add_location(a5, file$7, 67, 38, 2384);
    			attr_dev(p4, "class", "lh-copy f4 measure-wide");
    			add_location(p4, file$7, 66, 0, 2310);
    			attr_dev(p5, "class", "lh-copy f4 measure-wide");
    			add_location(p5, file$7, 72, 0, 2459);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p0, anchor);
    			append_dev(p0, t2);
    			append_dev(p0, a0);
    			append_dev(p0, t4);
    			append_dev(p0, a1);
    			append_dev(p0, t6);
    			append_dev(p0, span0);
    			append_dev(p0, t8);
    			append_dev(p0, span1);
    			append_dev(p0, t10);
    			append_dev(p0, span2);
    			append_dev(p0, t12);
    			append_dev(p0, span3);
    			append_dev(p0, t14);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, t16);
    			append_dev(p1, a2);
    			append_dev(p1, t18);
    			insert_dev(target, t19, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, a3);
    			append_dev(a3, div0);
    			append_dev(div0, img0);
    			append_dev(div0, t20);
    			append_dev(div0, p2);
    			append_dev(p2, span4);
    			append_dev(p2, t22);
    			append_dev(p2, span5);
    			append_dev(div2, t24);
    			append_dev(div2, a4);
    			append_dev(a4, div1);
    			append_dev(div1, img1);
    			append_dev(div1, t25);
    			append_dev(div1, p3);
    			append_dev(p3, span6);
    			append_dev(p3, t27);
    			append_dev(p3, span7);
    			insert_dev(target, t29, anchor);
    			insert_dev(target, p4, anchor);
    			append_dev(p4, t30);
    			append_dev(p4, a5);
    			append_dev(p4, t32);
    			insert_dev(target, t33, anchor);
    			insert_dev(target, p5, anchor);

    			if (!mounted) {
    				dispose = listen_dev(a2, "click", /*click_handler*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t19);
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t29);
    			if (detaching) detach_dev(p4);
    			if (detaching) detach_dev(t33);
    			if (detaching) detach_dev(p5);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	const dispatch = createEventDispatcher();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => dispatch('projects');
    	$$self.$capture_state = () => ({ createEventDispatcher, dispatch });
    	return [dispatch, click_handler];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/Experience.svelte generated by Svelte v3.46.3 */

    const file$6 = "src/Experience.svelte";

    function create_fragment$6(ctx) {
    	let h1;
    	let t0;
    	let span0;
    	let t2;
    	let div;
    	let h20;
    	let t4;
    	let h40;
    	let t5;
    	let span1;
    	let t7;
    	let p0;
    	let t9;
    	let p1;
    	let t11;
    	let h41;
    	let t12;
    	let span2;
    	let t14;
    	let p2;
    	let t16;
    	let p3;
    	let t18;
    	let h42;
    	let t19;
    	let span3;
    	let t21;
    	let p4;
    	let t23;
    	let p5;
    	let t25;
    	let h21;
    	let t27;
    	let h43;
    	let t28;
    	let span4;
    	let t30;
    	let p6;
    	let t32;
    	let h44;
    	let t33;
    	let span5;
    	let t35;
    	let p7;
    	let t37;
    	let h22;
    	let t39;
    	let h45;
    	let t40;
    	let span6;
    	let t42;
    	let p8;
    	let t44;
    	let p9;
    	let t46;
    	let h46;
    	let t47;
    	let span7;
    	let t49;
    	let p10;
    	let t51;
    	let p11;
    	let t53;
    	let h47;
    	let t54;
    	let span8;
    	let t56;
    	let p12;
    	let t58;
    	let p13;
    	let t60;
    	let h23;
    	let t62;
    	let h48;
    	let t63;
    	let span9;
    	let t65;
    	let p14;
    	let t67;
    	let p15;
    	let t69;
    	let h49;
    	let t70;
    	let span10;
    	let t72;
    	let p16;
    	let t74;
    	let p17;
    	let t76;
    	let h410;
    	let t77;
    	let span11;
    	let t79;
    	let p18;
    	let t81;
    	let p19;
    	let t83;
    	let h411;
    	let t84;
    	let span12;
    	let t86;
    	let p20;
    	let t88;
    	let p21;
    	let t90;
    	let h412;
    	let t91;
    	let span13;
    	let t93;
    	let p22;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text("Venkatesh Sivaraman ");
    			span0 = element("span");
    			span0.textContent = "Experience";
    			t2 = space();
    			div = element("div");
    			h20 = element("h2");
    			h20.textContent = "Industry";
    			t4 = space();
    			h40 = element("h4");
    			t5 = text("Verily Life Sciences ");
    			span1 = element("span");
    			span1.textContent = "Summer 2022";
    			t7 = space();
    			p0 = element("p");
    			p0.textContent = "Health Informatics Intern";
    			t9 = space();
    			p1 = element("p");
    			p1.textContent = "Worked with the Verily Health Platforms Data Science team, developing\n    self-supervised deep learning approaches to characterize heart failure\n    disease states from clinical notes.";
    			t11 = space();
    			h41 = element("h4");
    			t12 = text("Verily Life Sciences ");
    			span2 = element("span");
    			span2.textContent = "Summer 2019";
    			t14 = space();
    			p2 = element("p");
    			p2.textContent = "Software Engineering Intern";
    			t16 = space();
    			p3 = element("p");
    			p3.textContent = "Worked on the Clinical Studies Platform Data Science team. Designed and\n    implemented an Apache Beam pipeline using both novel and existing NLP\n    algorithms to process the ClinicalTrials.gov database.";
    			t18 = space();
    			h42 = element("h4");
    			t19 = text("Apple ");
    			span3 = element("span");
    			span3.textContent = "Summer 2017";
    			t21 = space();
    			p4 = element("p");
    			p4.textContent = "Software Engineering Intern";
    			t23 = space();
    			p5 = element("p");
    			p5.textContent = "Developed software in Swift supporting the CarPlay, HomeKit, and MFi\n    certification programs. One of three projects selected to present to Apple\n    VP of Product Integrity.";
    			t25 = space();
    			h21 = element("h2");
    			h21.textContent = "Education";
    			t27 = space();
    			h43 = element("h4");
    			t28 = text("Carnegie Mellon University ");
    			span4 = element("span");
    			span4.textContent = "2020 - present";
    			t30 = space();
    			p6 = element("p");
    			p6.textContent = "Advised by Prof. Adam Perer";
    			t32 = space();
    			h44 = element("h4");
    			t33 = text("Massachusetts Institute of Technology ");
    			span5 = element("span");
    			span5.textContent = "2016 - 2020";
    			t35 = space();
    			p7 = element("p");
    			p7.textContent = "Computer Science and Molecular Biology, Minor in Music";
    			t37 = space();
    			h22 = element("h2");
    			h22.textContent = "Research";
    			t39 = space();
    			h45 = element("h4");
    			t40 = text("Keating Lab, MIT Biology Department ");
    			span6 = element("span");
    			span6.textContent = "2018 - 2020";
    			t42 = space();
    			p8 = element("p");
    			p8.textContent = "Advised by Prof. Amy Keating";
    			t44 = space();
    			p9 = element("p");
    			p9.textContent = "Built a flexible high-throughput Python pipeline to compute and predict\n    protein binding affinities. Developed a C++ toolkit for designing novel\n    peptides, and an 3D visualization tool to render those peptides around a\n    known protein.";
    			t46 = space();
    			h46 = element("h4");
    			t47 = text("Structural Bioinformatics Lab, Pompeu Fabra University ");
    			span7 = element("span");
    			span7.textContent = "Summer 2018";
    			t49 = space();
    			p10 = element("p");
    			p10.textContent = "Advised by Prof. Baldo Oliva";
    			t51 = space();
    			p11 = element("p");
    			p11.textContent = "Created machine learning models to predict mutation-induced changes in\n    protein-protein and DNA-transcription factor interactions.";
    			t53 = space();
    			h47 = element("h4");
    			t54 = text("Kloczkowski Lab, Nationwide Children's Hospital ");
    			span8 = element("span");
    			span8.textContent = "2014 - 2016";
    			t56 = space();
    			p12 = element("p");
    			p12.textContent = "Advised by Prof. Andrzej Kloczkowski";
    			t58 = space();
    			p13 = element("p");
    			p13.textContent = "Developed a novel algorithm to predict protein structure based on statistics\n    of amino acid orientations.";
    			t60 = space();
    			h23 = element("h2");
    			h23.textContent = "Teaching";
    			t62 = space();
    			h48 = element("h4");
    			t63 = text("Programming Usable Interfaces, CMU ");
    			span9 = element("span");
    			span9.textContent = "Fall 2022";
    			t65 = space();
    			p14 = element("p");
    			p14.textContent = "Taught by Prof. Alexandra Ion";
    			t67 = space();
    			p15 = element("p");
    			p15.textContent = "Led one of five lab sections, prepared lab, homework, and exam materials,\n    and graded assignments.";
    			t69 = space();
    			h49 = element("h4");
    			t70 = text("Interactive Data Science, CMU ");
    			span10 = element("span");
    			span10.textContent = "Spring 2022";
    			t72 = space();
    			p16 = element("p");
    			p16.textContent = "Taught by Prof. Adam Perer";
    			t74 = space();
    			p17 = element("p");
    			p17.textContent = "Led office hours, prepared lecture and lab materials, gave a lecture on\n    Uncertainty Visualization, and graded assignments.";
    			t76 = space();
    			h410 = element("h4");
    			t77 = text("Fundamentals of Music Processing, MIT ");
    			span11 = element("span");
    			span11.textContent = "Fall 2019";
    			t79 = space();
    			p18 = element("p");
    			p18.textContent = "Taught by Eric Humphrey";
    			t81 = space();
    			p19 = element("p");
    			p19.textContent = "As the only TA for the class, led office hours, helped prepare lecture, lab,\n    and homework materials, and taught a lecture on the music fingerprinting\n    algorithm (as used in Shazam).";
    			t83 = space();
    			h411 = element("h4");
    			t84 = text("Splash, MIT ");
    			span12 = element("span");
    			span12.textContent = "2018 and 2019";
    			t86 = space();
    			p20 = element("p");
    			p20.textContent = "Co-taught with Brian Mills";
    			t88 = space();
    			p21 = element("p");
    			p21.textContent = "Taught one-day classes to 20-40 high schoolers on topics such as film music\n    and music signal processing algorithms.";
    			t90 = space();
    			h412 = element("h4");
    			t91 = text("MehtA+ Machine Learning Bootcamp ");
    			span13 = element("span");
    			span13.textContent = "Summer 2020 and 2021";
    			t93 = space();
    			p22 = element("p");
    			p22.textContent = "Prepared and taught guest lectures on human-centered machine learning,\n    embedding representations, and uncertainty.";
    			attr_dev(span0, "class", "fw2");
    			add_location(span0, file$6, 1, 22, 39);
    			attr_dev(h1, "class", "mt2");
    			add_location(h1, file$6, 0, 0, 0);
    			add_location(h20, file$6, 5, 2, 115);
    			attr_dev(span1, "class", "fw2");
    			add_location(span1, file$6, 8, 25, 178);
    			attr_dev(h40, "class", "mb0");
    			add_location(h40, file$6, 7, 2, 136);
    			attr_dev(p0, "class", "lh-copy mv1");
    			add_location(p0, file$6, 10, 2, 225);
    			attr_dev(p1, "class", "lh-copy mv1 gray");
    			add_location(p1, file$6, 11, 2, 280);
    			attr_dev(span2, "class", "fw2");
    			add_location(span2, file$6, 18, 25, 550);
    			attr_dev(h41, "class", "mb0");
    			add_location(h41, file$6, 17, 2, 508);
    			attr_dev(p2, "class", "lh-copy mv1");
    			add_location(p2, file$6, 20, 2, 597);
    			attr_dev(p3, "class", "lh-copy mv1 gray");
    			add_location(p3, file$6, 21, 2, 654);
    			attr_dev(span3, "class", "fw2");
    			add_location(span3, file$6, 28, 10, 929);
    			attr_dev(h42, "class", "mb0");
    			add_location(h42, file$6, 27, 2, 902);
    			attr_dev(p4, "class", "lh-copy mv1");
    			add_location(p4, file$6, 30, 2, 976);
    			attr_dev(p5, "class", "lh-copy mv1 gray");
    			add_location(p5, file$6, 31, 2, 1033);
    			add_location(h21, file$6, 37, 2, 1253);
    			attr_dev(span4, "class", "fw2");
    			add_location(span4, file$6, 39, 31, 1322);
    			attr_dev(h43, "class", "mb0");
    			add_location(h43, file$6, 38, 2, 1274);
    			attr_dev(p6, "class", "lh-copy mv1");
    			add_location(p6, file$6, 41, 2, 1372);
    			attr_dev(span5, "class", "fw2");
    			add_location(span5, file$6, 44, 42, 1489);
    			attr_dev(h44, "class", "mb0");
    			add_location(h44, file$6, 43, 2, 1430);
    			attr_dev(p7, "class", "lh-copy mv1");
    			add_location(p7, file$6, 46, 2, 1536);
    			add_location(h22, file$6, 50, 2, 1629);
    			attr_dev(span6, "class", "fw2");
    			add_location(span6, file$6, 52, 40, 1706);
    			attr_dev(h45, "class", "mb0");
    			add_location(h45, file$6, 51, 2, 1649);
    			attr_dev(p8, "class", "lh-copy mv1");
    			add_location(p8, file$6, 54, 2, 1753);
    			attr_dev(p9, "class", "lh-copy mv1 gray");
    			add_location(p9, file$6, 55, 2, 1811);
    			attr_dev(span7, "class", "fw2");
    			add_location(span7, file$6, 63, 59, 2174);
    			attr_dev(h46, "class", "mb0");
    			add_location(h46, file$6, 62, 2, 2098);
    			attr_dev(p10, "class", "lh-copy mv1");
    			add_location(p10, file$6, 67, 2, 2233);
    			attr_dev(p11, "class", "lh-copy mv1 gray");
    			add_location(p11, file$6, 68, 2, 2291);
    			attr_dev(span8, "class", "fw2");
    			add_location(span8, file$6, 74, 52, 2537);
    			attr_dev(h47, "class", "mb0");
    			add_location(h47, file$6, 73, 2, 2468);
    			attr_dev(p12, "class", "lh-copy mv1");
    			add_location(p12, file$6, 78, 2, 2596);
    			attr_dev(p13, "class", "lh-copy mv1 gray");
    			add_location(p13, file$6, 79, 2, 2662);
    			add_location(h23, file$6, 84, 2, 2814);
    			attr_dev(span9, "class", "fw2");
    			add_location(span9, file$6, 87, 39, 2891);
    			attr_dev(h48, "class", "mb0");
    			add_location(h48, file$6, 86, 2, 2835);
    			attr_dev(p14, "class", "lh-copy mv1");
    			add_location(p14, file$6, 89, 2, 2936);
    			attr_dev(p15, "class", "lh-copy mv1 gray");
    			add_location(p15, file$6, 90, 2, 2995);
    			attr_dev(span10, "class", "fw2");
    			add_location(span10, file$6, 96, 34, 3191);
    			attr_dev(h49, "class", "mb0");
    			add_location(h49, file$6, 95, 2, 3140);
    			attr_dev(p16, "class", "lh-copy mv1");
    			add_location(p16, file$6, 98, 2, 3238);
    			attr_dev(p17, "class", "lh-copy mv1 gray");
    			add_location(p17, file$6, 99, 2, 3294);
    			attr_dev(span11, "class", "fw2");
    			add_location(span11, file$6, 105, 42, 3523);
    			attr_dev(h410, "class", "mb0");
    			add_location(h410, file$6, 104, 2, 3464);
    			attr_dev(p18, "class", "lh-copy mv1");
    			add_location(p18, file$6, 107, 2, 3568);
    			attr_dev(p19, "class", "lh-copy mv1 gray");
    			add_location(p19, file$6, 108, 2, 3621);
    			attr_dev(span12, "class", "fw2");
    			add_location(span12, file$6, 115, 16, 3886);
    			attr_dev(h411, "class", "mb0");
    			add_location(h411, file$6, 114, 2, 3853);
    			attr_dev(p20, "class", "lh-copy mv1");
    			add_location(p20, file$6, 117, 2, 3935);
    			attr_dev(p21, "class", "lh-copy mv1 gray");
    			add_location(p21, file$6, 118, 2, 3991);
    			attr_dev(span13, "class", "fw2");
    			add_location(span13, file$6, 124, 37, 4208);
    			attr_dev(h412, "class", "mb0");
    			add_location(h412, file$6, 123, 2, 4154);
    			attr_dev(p22, "class", "lh-copy mv1 gray");
    			add_location(p22, file$6, 128, 2, 4276);
    			attr_dev(div, "class", "mb4 measure-wide");
    			add_location(div, file$6, 4, 0, 82);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			append_dev(h1, span0);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, h20);
    			append_dev(div, t4);
    			append_dev(div, h40);
    			append_dev(h40, t5);
    			append_dev(h40, span1);
    			append_dev(div, t7);
    			append_dev(div, p0);
    			append_dev(div, t9);
    			append_dev(div, p1);
    			append_dev(div, t11);
    			append_dev(div, h41);
    			append_dev(h41, t12);
    			append_dev(h41, span2);
    			append_dev(div, t14);
    			append_dev(div, p2);
    			append_dev(div, t16);
    			append_dev(div, p3);
    			append_dev(div, t18);
    			append_dev(div, h42);
    			append_dev(h42, t19);
    			append_dev(h42, span3);
    			append_dev(div, t21);
    			append_dev(div, p4);
    			append_dev(div, t23);
    			append_dev(div, p5);
    			append_dev(div, t25);
    			append_dev(div, h21);
    			append_dev(div, t27);
    			append_dev(div, h43);
    			append_dev(h43, t28);
    			append_dev(h43, span4);
    			append_dev(div, t30);
    			append_dev(div, p6);
    			append_dev(div, t32);
    			append_dev(div, h44);
    			append_dev(h44, t33);
    			append_dev(h44, span5);
    			append_dev(div, t35);
    			append_dev(div, p7);
    			append_dev(div, t37);
    			append_dev(div, h22);
    			append_dev(div, t39);
    			append_dev(div, h45);
    			append_dev(h45, t40);
    			append_dev(h45, span6);
    			append_dev(div, t42);
    			append_dev(div, p8);
    			append_dev(div, t44);
    			append_dev(div, p9);
    			append_dev(div, t46);
    			append_dev(div, h46);
    			append_dev(h46, t47);
    			append_dev(h46, span7);
    			append_dev(div, t49);
    			append_dev(div, p10);
    			append_dev(div, t51);
    			append_dev(div, p11);
    			append_dev(div, t53);
    			append_dev(div, h47);
    			append_dev(h47, t54);
    			append_dev(h47, span8);
    			append_dev(div, t56);
    			append_dev(div, p12);
    			append_dev(div, t58);
    			append_dev(div, p13);
    			append_dev(div, t60);
    			append_dev(div, h23);
    			append_dev(div, t62);
    			append_dev(div, h48);
    			append_dev(h48, t63);
    			append_dev(h48, span9);
    			append_dev(div, t65);
    			append_dev(div, p14);
    			append_dev(div, t67);
    			append_dev(div, p15);
    			append_dev(div, t69);
    			append_dev(div, h49);
    			append_dev(h49, t70);
    			append_dev(h49, span10);
    			append_dev(div, t72);
    			append_dev(div, p16);
    			append_dev(div, t74);
    			append_dev(div, p17);
    			append_dev(div, t76);
    			append_dev(div, h410);
    			append_dev(h410, t77);
    			append_dev(h410, span11);
    			append_dev(div, t79);
    			append_dev(div, p18);
    			append_dev(div, t81);
    			append_dev(div, p19);
    			append_dev(div, t83);
    			append_dev(div, h411);
    			append_dev(h411, t84);
    			append_dev(h411, span12);
    			append_dev(div, t86);
    			append_dev(div, p20);
    			append_dev(div, t88);
    			append_dev(div, p21);
    			append_dev(div, t90);
    			append_dev(div, h412);
    			append_dev(h412, t91);
    			append_dev(h412, span13);
    			append_dev(div, t93);
    			append_dev(div, p22);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props) {
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
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Experience",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/Card.svelte generated by Svelte v3.46.3 */

    const file$5 = "src/Card.svelte";

    // (21:27) 
    function create_if_block_1$2(ctx) {
    	let div;
    	let iframe;
    	let iframe_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			iframe = element("iframe");
    			set_style(iframe, "position", "absolute");
    			set_style(iframe, "top", "0");
    			set_style(iframe, "left", "0");
    			set_style(iframe, "width", "100%");
    			set_style(iframe, "height", "100%");
    			if (!src_url_equal(iframe.src, iframe_src_value = /*videoSrc*/ ctx[3])) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "title", "YouTube video player");
    			attr_dev(iframe, "frameborder", "0");
    			attr_dev(iframe, "allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$5, 22, 10, 602);
    			attr_dev(div, "class", "video-container svelte-1crdtd1");
    			add_location(div, file$5, 21, 8, 562);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, iframe);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*videoSrc*/ 8 && !src_url_equal(iframe.src, iframe_src_value = /*videoSrc*/ ctx[3])) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(21:27) ",
    		ctx
    	});

    	return block;
    }

    // (13:6) {#if !!imageSrc}
    function create_if_block$2(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*imageSrc*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "db w-100 card-img br2 br--top svelte-1crdtd1");
    			attr_dev(img, "alt", /*imageAlt*/ ctx[1]);
    			add_location(img, file$5, 14, 10, 389);
    			attr_dev(div, "class", "img-container svelte-1crdtd1");
    			add_location(div, file$5, 13, 8, 351);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*imageSrc*/ 1 && !src_url_equal(img.src, img_src_value = /*imageSrc*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*imageAlt*/ 2) {
    				attr_dev(img, "alt", /*imageAlt*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(13:6) {#if !!imageSrc}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div2;
    	let a;
    	let div1;
    	let t;
    	let div0;
    	let current;

    	function select_block_type(ctx, dirty) {
    		if (!!/*imageSrc*/ ctx[0]) return create_if_block$2;
    		if (!!/*videoSrc*/ ctx[3]) return create_if_block_1$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			a = element("a");
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "pa2 card-content svelte-1crdtd1");
    			add_location(div0, file$5, 32, 6, 973);
    			attr_dev(div1, "class", "card pa3 bg-animate hover-bg-near-white pointer flex flex-column svelte-1crdtd1");
    			add_location(div1, file$5, 9, 4, 230);
    			attr_dev(a, "href", /*url*/ ctx[2]);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "link black");
    			add_location(a, file$5, 8, 2, 176);
    			attr_dev(div2, "class", "fl w-50-ns w-100-m w-100 pa3");
    			add_location(div2, file$5, 7, 0, 131);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, a);
    			append_dev(a, div1);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div1, t);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*url*/ 4) {
    				attr_dev(a, "href", /*url*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);

    			if (if_block) {
    				if_block.d();
    			}

    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, ['default']);
    	let { imageSrc = null } = $$props;
    	let { imageAlt = '' } = $$props;
    	let { url = '' } = $$props;
    	let { videoSrc = null } = $$props;
    	const writable_props = ['imageSrc', 'imageAlt', 'url', 'videoSrc'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('imageSrc' in $$props) $$invalidate(0, imageSrc = $$props.imageSrc);
    		if ('imageAlt' in $$props) $$invalidate(1, imageAlt = $$props.imageAlt);
    		if ('url' in $$props) $$invalidate(2, url = $$props.url);
    		if ('videoSrc' in $$props) $$invalidate(3, videoSrc = $$props.videoSrc);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ imageSrc, imageAlt, url, videoSrc });

    	$$self.$inject_state = $$props => {
    		if ('imageSrc' in $$props) $$invalidate(0, imageSrc = $$props.imageSrc);
    		if ('imageAlt' in $$props) $$invalidate(1, imageAlt = $$props.imageAlt);
    		if ('url' in $$props) $$invalidate(2, url = $$props.url);
    		if ('videoSrc' in $$props) $$invalidate(3, videoSrc = $$props.videoSrc);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [imageSrc, imageAlt, url, videoSrc, $$scope, slots];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			imageSrc: 0,
    			imageAlt: 1,
    			url: 2,
    			videoSrc: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get imageSrc() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imageSrc(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imageAlt() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imageAlt(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get videoSrc() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set videoSrc(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Projects.svelte generated by Svelte v3.46.3 */
    const file$4 = "src/Projects.svelte";

    // (13:2) <Card     imageSrc="assets/ai-clinician.gif"     imageAlt="Screenshot of AI Clinician Explorer showing charts of patient vitals and labs that dynamically update as the user drags a slider to navigate through the patient's trajectory."     url="https://github.com/cmudig/ai-clinician-explorer"   >
    function create_default_slot_4$1(ctx) {
    	let h3;
    	let t0;
    	let span;
    	let t2;
    	let p0;
    	let t4;
    	let p1;
    	let a;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text("AI Clinician Explorer: ");
    			span = element("span");
    			span.textContent = "Patient Trajectory Visualization";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "This prototype tool allows clinicians to browse detailed trajectories for\n      patients with sepsis, and compare predictions of a reinforcement learning\n      model (the AI Clinician) with actual clinician actions. The live demo is\n      currently unavailable due to the sensitivity of patient data.";
    			t4 = space();
    			p1 = element("p");
    			a = element("a");
    			a.textContent = "GitHub";
    			attr_dev(span, "class", "fw3 ml1");
    			add_location(span, file$4, 18, 29, 729);
    			attr_dev(h3, "class", "mb0 lh-title");
    			add_location(h3, file$4, 17, 4, 674);
    			attr_dev(p0, "class", "lh-copy");
    			add_location(p0, file$4, 22, 4, 821);
    			attr_dev(a, "class", "f6 link dim ph3 pv2 dib white bg-black");
    			attr_dev(a, "href", "https://github.com/cmudig/ai-clinician-explorer");
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$4, 29, 6, 1171);
    			add_location(p1, file$4, 28, 4, 1161);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			append_dev(h3, span);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, a);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(p1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(13:2) <Card     imageSrc=\\\"assets/ai-clinician.gif\\\"     imageAlt=\\\"Screenshot of AI Clinician Explorer showing charts of patient vitals and labs that dynamically update as the user drags a slider to navigate through the patient's trajectory.\\\"     url=\\\"https://github.com/cmudig/ai-clinician-explorer\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (37:2) <Card     imageSrc="assets/emblaze.png"     imageAlt="Two screenshots of the Emblaze user interface."     url="https://github.com/cmudig/emblaze"   >
    function create_default_slot_3$1(ctx) {
    	let h3;
    	let t0;
    	let span;
    	let t2;
    	let p0;
    	let t4;
    	let p1;
    	let a0;
    	let t6;
    	let a1;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text("Emblaze: ");
    			span = element("span");
    			span.textContent = "Interactive Embedding Comparison Widget";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "Emblaze is a Jupyter notebook widget that enables creators of machine\n      learning (ML) models to analyze and compare embedding spaces.";
    			t4 = space();
    			p1 = element("p");
    			a0 = element("a");
    			a0.textContent = "Demo";
    			t6 = space();
    			a1 = element("a");
    			a1.textContent = "GitHub";
    			attr_dev(span, "class", "fw3 ml1");
    			add_location(span, file$4, 42, 15, 1550);
    			attr_dev(h3, "class", "mb0 lh-title");
    			add_location(h3, file$4, 41, 4, 1509);
    			attr_dev(p0, "class", "lh-copy");
    			add_location(p0, file$4, 46, 4, 1649);
    			attr_dev(a0, "class", "f6 link dim ph3 pv2 dib white bg-blue");
    			attr_dev(a0, "href", "https://bit.ly/emblaze-demo");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$4, 51, 6, 1836);
    			attr_dev(a1, "class", "f6 link dim ph3 pv2 dib white bg-black");
    			attr_dev(a1, "href", "https://github.com/cmudig/emblaze");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$4, 56, 6, 1982);
    			add_location(p1, file$4, 50, 4, 1826);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			append_dev(h3, span);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, a0);
    			append_dev(p1, t6);
    			append_dev(p1, a1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(p1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(37:2) <Card     imageSrc=\\\"assets/emblaze.png\\\"     imageAlt=\\\"Two screenshots of the Emblaze user interface.\\\"     url=\\\"https://github.com/cmudig/emblaze\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (64:2) <Card     imageSrc="assets/textessence.png"     imageAlt="Screenshot of TextEssence that shows a scatter plot of COVID concepts"     url="https://textessence.dbmi.pitt.edu"   >
    function create_default_slot_2$1(ctx) {
    	let h3;
    	let t0;
    	let span;
    	let t2;
    	let p0;
    	let t4;
    	let p1;
    	let a0;
    	let t6;
    	let a1;
    	let t8;
    	let a2;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text("TextEssence: ");
    			span = element("span");
    			span.textContent = "Comparison of COVID Clinical Concepts";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "This demo (presented at NAACL 2021) allows you to study and compare\n      embeddings of clinical concepts related to COVID-19. The demo currently\n      supports Firefox and Chrome. Developed with Denis Newman-Griffis.";
    			t4 = space();
    			p1 = element("p");
    			a0 = element("a");
    			a0.textContent = "Demo";
    			t6 = space();
    			a1 = element("a");
    			a1.textContent = "GitHub";
    			t8 = space();
    			a2 = element("a");
    			a2.textContent = "Paper";
    			attr_dev(span, "class", "fw3 ml1");
    			add_location(span, file$4, 69, 19, 2378);
    			attr_dev(h3, "class", "mb0 lh-title");
    			add_location(h3, file$4, 68, 4, 2333);
    			attr_dev(p0, "class", "lh-copy");
    			add_location(p0, file$4, 73, 4, 2475);
    			attr_dev(a0, "class", "f6 link dim ph3 pv2 dib white bg-blue");
    			attr_dev(a0, "href", "https://textessence.dbmi.pitt.edu");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$4, 79, 6, 2742);
    			attr_dev(a1, "class", "f6 link dim ph3 pv2 dib white bg-black");
    			attr_dev(a1, "href", "https://github.com/drgriffis/text-essence");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$4, 84, 6, 2894);
    			attr_dev(a2, "class", "f6 link dim ph3 pv2 dib white bg-black");
    			attr_dev(a2, "href", "https://aclanthology.org/2021.naacl-demos.13/");
    			attr_dev(a2, "target", "_blank");
    			add_location(a2, file$4, 89, 6, 3057);
    			add_location(p1, file$4, 78, 4, 2732);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			append_dev(h3, span);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, a0);
    			append_dev(p1, t6);
    			append_dev(p1, a1);
    			append_dev(p1, t8);
    			append_dev(p1, a2);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(p1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(64:2) <Card     imageSrc=\\\"assets/textessence.png\\\"     imageAlt=\\\"Screenshot of TextEssence that shows a scatter plot of COVID concepts\\\"     url=\\\"https://textessence.dbmi.pitt.edu\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (97:2) <Card     imageSrc="assets/fireroad.png"     imageAlt="Two smartphones showing screenshots of FireRoad"     url="https://fireroad.mit.edu"   >
    function create_default_slot_1$1(ctx) {
    	let h3;
    	let t0;
    	let span;
    	let t2;
    	let p0;
    	let t4;
    	let p1;
    	let a0;
    	let t6;
    	let a1;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text("FireRoad: ");
    			span = element("span");
    			span.textContent = "MIT Course Planner";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "FireRoad is a web, iOS, and Android application that helps MIT students\n      plan what courses they want to fulfill their undergraduate requirements.\n      It offers an easy-to-use API on which students can build new applications.";
    			t4 = space();
    			p1 = element("p");
    			a0 = element("a");
    			a0.textContent = "Website";
    			t6 = space();
    			a1 = element("a");
    			a1.textContent = "GitHub";
    			attr_dev(span, "class", "fw3 ml1");
    			add_location(span, file$4, 102, 16, 3427);
    			attr_dev(h3, "class", "mb0 lh-title");
    			add_location(h3, file$4, 101, 4, 3385);
    			attr_dev(p0, "class", "lh-copy");
    			add_location(p0, file$4, 104, 4, 3489);
    			attr_dev(a0, "class", "f6 link dim ph3 pv2 dib white bg-blue");
    			attr_dev(a0, "href", "https://fireroad.mit.edu");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$4, 110, 6, 3770);
    			attr_dev(a1, "class", "f6 link dim ph3 pv2 dib white bg-black");
    			attr_dev(a1, "href", "https://github.com/venkatesh-sivaraman/fireroad-server");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$4, 115, 6, 3916);
    			add_location(p1, file$4, 109, 4, 3760);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			append_dev(h3, span);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, a0);
    			append_dev(p1, t6);
    			append_dev(p1, a1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(p1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(97:2) <Card     imageSrc=\\\"assets/fireroad.png\\\"     imageAlt=\\\"Two smartphones showing screenshots of FireRoad\\\"     url=\\\"https://fireroad.mit.edu\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (123:2) <Card     imageSrc="assets/shapesynth.png"     imageAlt="Two screenshots of ShapeSynth showing colored shapes in each corner"     url="https://github.com/mdhuggins/shapesynth"   >
    function create_default_slot$1(ctx) {
    	let h3;
    	let t0;
    	let span;
    	let t2;
    	let p0;
    	let t4;
    	let p1;
    	let a;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text("ShapeSynth: ");
    			span = element("span");
    			span.textContent = "Multimodal Music Generation";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "This course project from MIT's Interactive Music Systems class (taught by\n      Eran Egozy) allows users to create and visualize synthesized music using\n      the keyboard, a MIDI instrument, or a Kinect. Created with Matthew\n      Huggins.";
    			t4 = space();
    			p1 = element("p");
    			a = element("a");
    			a.textContent = "GitHub";
    			attr_dev(span, "class", "fw3 ml1");
    			add_location(span, file$4, 128, 18, 4335);
    			attr_dev(h3, "class", "mb0 lh-title");
    			add_location(h3, file$4, 127, 4, 4291);
    			attr_dev(p0, "class", "lh-copy");
    			add_location(p0, file$4, 130, 4, 4406);
    			attr_dev(a, "class", "f6 link dim ph3 pv2 dib white bg-black");
    			attr_dev(a, "href", "https://github.com/mdhuggins/shapesynth");
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$4, 137, 6, 4696);
    			add_location(p1, file$4, 136, 4, 4686);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			append_dev(h3, span);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, a);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(p1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(123:2) <Card     imageSrc=\\\"assets/shapesynth.png\\\"     imageAlt=\\\"Two screenshots of ShapeSynth showing colored shapes in each corner\\\"     url=\\\"https://github.com/mdhuggins/shapesynth\\\"   >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let h1;
    	let t0;
    	let span;
    	let t2;
    	let p;
    	let t4;
    	let div;
    	let card0;
    	let t5;
    	let card1;
    	let t6;
    	let card2;
    	let t7;
    	let card3;
    	let t8;
    	let card4;
    	let current;

    	card0 = new Card({
    			props: {
    				imageSrc: "assets/ai-clinician.gif",
    				imageAlt: "Screenshot of AI Clinician Explorer showing charts of patient vitals and labs that dynamically update as the user drags a slider to navigate through the patient's trajectory.",
    				url: "https://github.com/cmudig/ai-clinician-explorer",
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card1 = new Card({
    			props: {
    				imageSrc: "assets/emblaze.png",
    				imageAlt: "Two screenshots of the Emblaze user interface.",
    				url: "https://github.com/cmudig/emblaze",
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card2 = new Card({
    			props: {
    				imageSrc: "assets/textessence.png",
    				imageAlt: "Screenshot of TextEssence that shows a scatter plot of COVID concepts",
    				url: "https://textessence.dbmi.pitt.edu",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card3 = new Card({
    			props: {
    				imageSrc: "assets/fireroad.png",
    				imageAlt: "Two smartphones showing screenshots of FireRoad",
    				url: "https://fireroad.mit.edu",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card4 = new Card({
    			props: {
    				imageSrc: "assets/shapesynth.png",
    				imageAlt: "Two screenshots of ShapeSynth showing colored shapes in each corner",
    				url: "https://github.com/mdhuggins/shapesynth",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text("Venkatesh Sivaraman ");
    			span = element("span");
    			span.textContent = "Projects";
    			t2 = space();
    			p = element("p");
    			p.textContent = "Here's a sampling of some of the projects and demos I've created in the past.\n  Contact me if you'd like to chat about some of the work I'm doing right now!";
    			t4 = space();
    			div = element("div");
    			create_component(card0.$$.fragment);
    			t5 = space();
    			create_component(card1.$$.fragment);
    			t6 = space();
    			create_component(card2.$$.fragment);
    			t7 = space();
    			create_component(card3.$$.fragment);
    			t8 = space();
    			create_component(card4.$$.fragment);
    			attr_dev(span, "class", "fw2");
    			add_location(span, file$4, 5, 22, 95);
    			attr_dev(h1, "class", "mt2");
    			add_location(h1, file$4, 4, 0, 56);
    			attr_dev(p, "class", "lh-copy measure f5");
    			add_location(p, file$4, 7, 0, 135);
    			attr_dev(div, "class", "cf shift-left equal-height svelte-cc53z3");
    			add_location(div, file$4, 11, 0, 330);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			append_dev(h1, span);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(card0, div, null);
    			append_dev(div, t5);
    			mount_component(card1, div, null);
    			append_dev(div, t6);
    			mount_component(card2, div, null);
    			append_dev(div, t7);
    			mount_component(card3, div, null);
    			append_dev(div, t8);
    			mount_component(card4, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const card0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card0_changes.$$scope = { dirty, ctx };
    			}

    			card0.$set(card0_changes);
    			const card1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card1_changes.$$scope = { dirty, ctx };
    			}

    			card1.$set(card1_changes);
    			const card2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card2_changes.$$scope = { dirty, ctx };
    			}

    			card2.$set(card2_changes);
    			const card3_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card3_changes.$$scope = { dirty, ctx };
    			}

    			card3.$set(card3_changes);
    			const card4_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card4_changes.$$scope = { dirty, ctx };
    			}

    			card4.$set(card4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card0.$$.fragment, local);
    			transition_in(card1.$$.fragment, local);
    			transition_in(card2.$$.fragment, local);
    			transition_in(card3.$$.fragment, local);
    			transition_in(card4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card0.$$.fragment, local);
    			transition_out(card1.$$.fragment, local);
    			transition_out(card2.$$.fragment, local);
    			transition_out(card3.$$.fragment, local);
    			transition_out(card4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div);
    			destroy_component(card0);
    			destroy_component(card1);
    			destroy_component(card2);
    			destroy_component(card3);
    			destroy_component(card4);
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

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Projects', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Projects> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Card });
    	return [];
    }

    class Projects extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Projects",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/Publications.svelte generated by Svelte v3.46.3 */

    const file$3 = "src/Publications.svelte";

    function create_fragment$3(ctx) {
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
    	let em1;
    	let t10;
    	let h21;
    	let t12;
    	let p1;
    	let t13;
    	let strong1;
    	let t15;
    	let em2;
    	let t17;
    	let em3;
    	let t19;
    	let a0;
    	let t21;
    	let p2;
    	let t22;
    	let strong2;
    	let t24;
    	let em4;
    	let t26;
    	let a1;
    	let t28;
    	let p3;
    	let t29;
    	let strong3;
    	let t31;
    	let em5;
    	let t33;
    	let a2;
    	let t35;
    	let a3;
    	let t37;
    	let p4;
    	let strong4;
    	let t39;
    	let em6;
    	let t41;
    	let a4;
    	let t43;
    	let a5;
    	let t45;
    	let a6;
    	let t47;
    	let p5;
    	let t48;
    	let strong5;
    	let t50;
    	let em7;
    	let t52;
    	let h22;
    	let t54;
    	let p6;
    	let t55;
    	let strong6;
    	let t57;
    	let em8;
    	let t59;
    	let a7;
    	let t61;
    	let a8;
    	let t63;
    	let p7;
    	let t64;
    	let strong7;
    	let t66;
    	let em9;
    	let t68;
    	let a9;
    	let t70;
    	let a10;
    	let t72;
    	let a11;
    	let t74;
    	let p8;
    	let t75;
    	let strong8;
    	let t77;
    	let em10;
    	let t79;
    	let a12;
    	let t81;
    	let h23;
    	let t83;
    	let p9;
    	let strong9;
    	let t85;
    	let em11;
    	let t87;
    	let a13;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text("Venkatesh Sivaraman ");
    			span = element("span");
    			span.textContent = "Publications";
    			t2 = space();
    			section = element("section");
    			h20 = element("h2");
    			h20.textContent = "2023";
    			t4 = space();
    			p0 = element("p");
    			strong0 = element("strong");
    			strong0.textContent = "Sivaraman, V.";
    			t6 = text(", Bukowski, L., Levin, J., Kahn, J.M., Perer,\n    A. ");
    			em0 = element("em");
    			em0.textContent = "(Under review)";
    			t8 = text(". Ignore, trust, or negotiate: Understanding\n    clinician acceptance of AI-based treatment recommendations in health care.\n    ");
    			em1 = element("em");
    			em1.textContent = "Under review for ACM CHI 2023.";
    			t10 = space();
    			h21 = element("h2");
    			h21.textContent = "2022";
    			t12 = space();
    			p1 = element("p");
    			t13 = text("Kawakami, A., ");
    			strong1 = element("strong");
    			strong1.textContent = "Sivaraman, V.";
    			t15 = space();
    			em2 = element("em");
    			em2.textContent = "(co-first authors)";
    			t17 = text(",\n    Stapleton, L., Cheng, H., Perer, A., Wu, S., Zhu, H., Holstein, K. (2022).\n    \"Why Do I Care What's Similar?\" Probing Challenges in AI-Assisted Child\n    Welfare Decision-Making through Worker-AI Interface Design Concepts.\n    ");
    			em3 = element("em");
    			em3.textContent = "ACM DIS 2022.";
    			t19 = space();
    			a0 = element("a");
    			a0.textContent = "[Article]";
    			t21 = space();
    			p2 = element("p");
    			t22 = text("Cheng, H., Stapleton, L., Kawakami, A., ");
    			strong2 = element("strong");
    			strong2.textContent = "Sivaraman, V.";
    			t24 = text(",\n    Cheng, Y., Qing, D., Perer, A., Holstein, K., Wu, S., Zhu, H. (2022). How\n    Child Welfare Workers Reduce Racial Disparities in Algorithmic Decisions.\n    ");
    			em4 = element("em");
    			em4.textContent = "ACM CHI 2022.";
    			t26 = space();
    			a1 = element("a");
    			a1.textContent = "[Article]";
    			t28 = space();
    			p3 = element("p");
    			t29 = text("Kawakami, A., ");
    			strong3 = element("strong");
    			strong3.textContent = "Sivaraman, V.";
    			t31 = text(", Cheng, H., Stapleton, L.,\n    Cheng, Y., Qing, D., Perer, A., Wu, S., Zhu, H., Holstein, K. (2022).\n    Improving Human-AI Partnerships in Child Welfare: Understanding Worker\n    Practices, Challenges, and Desires for Algorithmic Decision Support.\n    ");
    			em5 = element("em");
    			em5.textContent = "ACM CHI 2022.";
    			t33 = space();
    			a2 = element("a");
    			a2.textContent = "[Preprint]";
    			t35 = space();
    			a3 = element("a");
    			a3.textContent = "[Article]";
    			t37 = space();
    			p4 = element("p");
    			strong4 = element("strong");
    			strong4.textContent = "Sivaraman, V.";
    			t39 = text(", Wu, Y., & Perer, A. (2022). Emblaze:\n    Illuminating machine learning representations through interactive comparison\n    of embedding spaces. ");
    			em6 = element("em");
    			em6.textContent = "ACM IUI 2022.";
    			t41 = space();
    			a4 = element("a");
    			a4.textContent = "[Demo]";
    			t43 = space();
    			a5 = element("a");
    			a5.textContent = "[GitHub]";
    			t45 = space();
    			a6 = element("a");
    			a6.textContent = "[Article]";
    			t47 = space();
    			p5 = element("p");
    			t48 = text("Swanson, S., ");
    			strong5 = element("strong");
    			strong5.textContent = "Sivaraman, V.";
    			t50 = text(", Grigoryan, G., Keating, A.\n    (2022). Tertiary motifs as building blocks for the design of protein-binding\n    peptides. ");
    			em7 = element("em");
    			em7.textContent = "To appear in Protein Science.";
    			t52 = space();
    			h22 = element("h2");
    			h22.textContent = "2021";
    			t54 = space();
    			p6 = element("p");
    			t55 = text("Wu, J., ");
    			strong6 = element("strong");
    			strong6.textContent = "Sivaraman, V.";
    			t57 = text(", Kumar, D. (first three authors equal\n    contribution), Banda, J. M., & Sontag, D. (2021). Pulse of the pandemic:\n    Iterative topic filtering for clinical information extraction from social\n    media. ");
    			em8 = element("em");
    			em8.textContent = "Journal of Biomedical Informatics.";
    			t59 = space();
    			a7 = element("a");
    			a7.textContent = "[Article]";
    			t61 = space();
    			a8 = element("a");
    			a8.textContent = "[Preprint]";
    			t63 = space();
    			p7 = element("p");
    			t64 = text("Newman-Griffis, D., ");
    			strong7 = element("strong");
    			strong7.textContent = "Sivaraman, V.";
    			t66 = text(", Perer, A.,\n    Fosler-Lussier, E., & Hochheiser, H. (2021). TextEssence: A Tool for\n    Interactive Analysis of Semantic Shifts Between Corpora.\n    ");
    			em9 = element("em");
    			em9.textContent = "NAACL Systems Demonstration.";
    			t68 = space();
    			a9 = element("a");
    			a9.textContent = "[Demo]";
    			t70 = space();
    			a10 = element("a");
    			a10.textContent = "[Article]";
    			t72 = space();
    			a11 = element("a");
    			a11.textContent = "[Preprint]";
    			t74 = space();
    			p8 = element("p");
    			t75 = text("Hwang, T., Parker, S. S., Hill, S. M., Ilunga, M. W., Grant, R. A.,\n    ");
    			strong8 = element("strong");
    			strong8.textContent = "Sivaraman, V.";
    			t77 = text(", Mouneimne, G., & Keating, A. E. (2021). A\n    proteome-wide screen uncovers diverse roles for sequence context surrounding\n    proline-rich motifs in Ena/VASP molecular recognition.\n    ");
    			em10 = element("em");
    			em10.textContent = "Under review.";
    			t79 = space();
    			a12 = element("a");
    			a12.textContent = "[Preprint]";
    			t81 = space();
    			h23 = element("h2");
    			h23.textContent = "Older";
    			t83 = space();
    			p9 = element("p");
    			strong9 = element("strong");
    			strong9.textContent = "Sivaraman, V.";
    			t85 = text(", Yoon, D., & Mitros, P. (2016). Simplified\n    audio production in asynchronous voice-based discussions.\n    ");
    			em11 = element("em");
    			em11.textContent = "ACM CHI 2016.";
    			t87 = space();
    			a13 = element("a");
    			a13.textContent = "[Article]";
    			attr_dev(span, "class", "fw2");
    			add_location(span, file$3, 1, 22, 39);
    			attr_dev(h1, "class", "mt2");
    			add_location(h1, file$3, 0, 0, 0);
    			add_location(h20, file$3, 5, 2, 125);
    			add_location(strong0, file$3, 7, 4, 149);
    			add_location(em0, file$3, 8, 7, 232);
    			add_location(em1, file$3, 10, 4, 383);
    			add_location(p0, file$3, 6, 2, 141);
    			add_location(h21, file$3, 12, 2, 432);
    			add_location(strong1, file$3, 14, 18, 470);
    			add_location(em2, file$3, 14, 49, 501);
    			add_location(em3, file$3, 18, 4, 762);
    			attr_dev(a0, "class", "link blue");
    			attr_dev(a0, "href", "https://dl.acm.org/doi/10.1145/3532106.3533556");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$3, 19, 4, 789);
    			add_location(p1, file$3, 13, 2, 448);
    			add_location(strong2, file$3, 26, 44, 974);
    			add_location(em4, file$3, 29, 4, 1166);
    			attr_dev(a1, "class", "link blue");
    			attr_dev(a1, "href", "https://dl.acm.org/doi/10.1145/3491102.3501831");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$3, 30, 4, 1193);
    			add_location(p2, file$3, 25, 2, 926);
    			add_location(strong3, file$3, 37, 18, 1352);
    			add_location(em5, file$3, 41, 4, 1636);
    			attr_dev(a2, "class", "link blue");
    			attr_dev(a2, "href", "https://arxiv.org/abs/2204.02310");
    			attr_dev(a2, "target", "_blank");
    			add_location(a2, file$3, 42, 4, 1663);
    			attr_dev(a3, "class", "link blue");
    			attr_dev(a3, "href", "https://dl.acm.org/doi/10.1145/3491102.3517439");
    			attr_dev(a3, "target", "_blank");
    			add_location(a3, file$3, 45, 4, 1771);
    			add_location(p3, file$3, 36, 2, 1330);
    			add_location(strong4, file$3, 52, 4, 1916);
    			add_location(em6, file$3, 54, 25, 2091);
    			attr_dev(a4, "class", "link blue");
    			attr_dev(a4, "href", "https://bit.ly/emblaze-demo");
    			attr_dev(a4, "target", "_blank");
    			add_location(a4, file$3, 55, 4, 2118);
    			attr_dev(a5, "class", "link blue");
    			attr_dev(a5, "href", "https://github.com/cmudig/emblaze");
    			attr_dev(a5, "target", "_blank");
    			add_location(a5, file$3, 58, 4, 2217);
    			attr_dev(a6, "class", "link blue");
    			attr_dev(a6, "href", "https://dl.acm.org/doi/10.1145/3490099.3511137");
    			attr_dev(a6, "target", "_blank");
    			add_location(a6, file$3, 63, 4, 2335);
    			add_location(p4, file$3, 51, 2, 1908);
    			add_location(strong5, file$3, 70, 17, 2493);
    			add_location(em7, file$3, 72, 14, 2647);
    			add_location(p5, file$3, 69, 2, 2472);
    			add_location(h22, file$3, 74, 2, 2695);
    			add_location(strong6, file$3, 76, 12, 2727);
    			add_location(em8, file$3, 79, 11, 2962);
    			attr_dev(a7, "class", "link blue");
    			attr_dev(a7, "href", "https://www.sciencedirect.com/science/article/abs/pii/S1532046421001738");
    			attr_dev(a7, "target", "_blank");
    			add_location(a7, file$3, 80, 4, 3010);
    			attr_dev(a8, "class", "link blue");
    			attr_dev(a8, "href", "https://arxiv.org/abs/2102.06836");
    			attr_dev(a8, "target", "_blank");
    			add_location(a8, file$3, 85, 4, 3167);
    			add_location(p6, file$3, 75, 2, 2711);
    			add_location(strong7, file$3, 90, 24, 3308);
    			add_location(em9, file$3, 93, 4, 3489);
    			attr_dev(a9, "class", "link blue");
    			attr_dev(a9, "href", "https://textessence.dbmi.pitt.edu");
    			attr_dev(a9, "target", "_blank");
    			add_location(a9, file$3, 94, 4, 3533);
    			attr_dev(a10, "class", "link blue");
    			attr_dev(a10, "href", "https://aclanthology.org/2021.naacl-demos.13/");
    			attr_dev(a10, "target", "_blank");
    			add_location(a10, file$3, 99, 4, 3649);
    			attr_dev(a11, "class", "link blue");
    			attr_dev(a11, "href", "https://arxiv.org/abs/2103.11029");
    			attr_dev(a11, "target", "_blank");
    			add_location(a11, file$3, 104, 4, 3780);
    			add_location(p7, file$3, 89, 2, 3280);
    			add_location(strong8, file$3, 110, 4, 3973);
    			add_location(em10, file$3, 113, 4, 4191);
    			attr_dev(a12, "class", "link blue");
    			attr_dev(a12, "href", "https://www.biorxiv.org/content/10.1101/2021.03.22.436451v1");
    			attr_dev(a12, "target", "_blank");
    			add_location(a12, file$3, 114, 4, 4218);
    			add_location(p8, file$3, 108, 2, 3893);
    			add_location(h23, file$3, 120, 2, 4369);
    			add_location(strong9, file$3, 122, 4, 4394);
    			add_location(em11, file$3, 124, 4, 4534);
    			attr_dev(a13, "class", "link blue");
    			attr_dev(a13, "href", "https://dl.acm.org/doi/10.1145/2858036.2858416");
    			attr_dev(a13, "target", "_blank");
    			add_location(a13, file$3, 125, 4, 4561);
    			add_location(p9, file$3, 121, 2, 4386);
    			attr_dev(section, "class", "lh-copy measure-wide");
    			add_location(section, file$3, 4, 0, 84);
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
    			append_dev(p0, t8);
    			append_dev(p0, em1);
    			append_dev(section, t10);
    			append_dev(section, h21);
    			append_dev(section, t12);
    			append_dev(section, p1);
    			append_dev(p1, t13);
    			append_dev(p1, strong1);
    			append_dev(p1, t15);
    			append_dev(p1, em2);
    			append_dev(p1, t17);
    			append_dev(p1, em3);
    			append_dev(p1, t19);
    			append_dev(p1, a0);
    			append_dev(section, t21);
    			append_dev(section, p2);
    			append_dev(p2, t22);
    			append_dev(p2, strong2);
    			append_dev(p2, t24);
    			append_dev(p2, em4);
    			append_dev(p2, t26);
    			append_dev(p2, a1);
    			append_dev(section, t28);
    			append_dev(section, p3);
    			append_dev(p3, t29);
    			append_dev(p3, strong3);
    			append_dev(p3, t31);
    			append_dev(p3, em5);
    			append_dev(p3, t33);
    			append_dev(p3, a2);
    			append_dev(p3, t35);
    			append_dev(p3, a3);
    			append_dev(section, t37);
    			append_dev(section, p4);
    			append_dev(p4, strong4);
    			append_dev(p4, t39);
    			append_dev(p4, em6);
    			append_dev(p4, t41);
    			append_dev(p4, a4);
    			append_dev(p4, t43);
    			append_dev(p4, a5);
    			append_dev(p4, t45);
    			append_dev(p4, a6);
    			append_dev(section, t47);
    			append_dev(section, p5);
    			append_dev(p5, t48);
    			append_dev(p5, strong5);
    			append_dev(p5, t50);
    			append_dev(p5, em7);
    			append_dev(section, t52);
    			append_dev(section, h22);
    			append_dev(section, t54);
    			append_dev(section, p6);
    			append_dev(p6, t55);
    			append_dev(p6, strong6);
    			append_dev(p6, t57);
    			append_dev(p6, em8);
    			append_dev(p6, t59);
    			append_dev(p6, a7);
    			append_dev(p6, t61);
    			append_dev(p6, a8);
    			append_dev(section, t63);
    			append_dev(section, p7);
    			append_dev(p7, t64);
    			append_dev(p7, strong7);
    			append_dev(p7, t66);
    			append_dev(p7, em9);
    			append_dev(p7, t68);
    			append_dev(p7, a9);
    			append_dev(p7, t70);
    			append_dev(p7, a10);
    			append_dev(p7, t72);
    			append_dev(p7, a11);
    			append_dev(section, t74);
    			append_dev(section, p8);
    			append_dev(p8, t75);
    			append_dev(p8, strong8);
    			append_dev(p8, t77);
    			append_dev(p8, em10);
    			append_dev(p8, t79);
    			append_dev(p8, a12);
    			append_dev(section, t81);
    			append_dev(section, h23);
    			append_dev(section, t83);
    			append_dev(section, p9);
    			append_dev(p9, strong9);
    			append_dev(p9, t85);
    			append_dev(p9, em11);
    			append_dev(p9, t87);
    			append_dev(p9, a13);
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
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
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
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Publications",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/Music.svelte generated by Svelte v3.46.3 */
    const file$2 = "src/Music.svelte";

    // (14:2) <Card     url="https://www.youtube.com/watch?v=1mqnrWxZ-xw"     videoSrc="https://www.youtube.com/embed/1mqnrWxZ-xw"   >
    function create_default_slot_9(ctx) {
    	let h3;
    	let t0;
    	let span;
    	let t2;
    	let p0;
    	let t4;
    	let p1;
    	let t5;
    	let em;
    	let t7;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text("Debussy: ");
    			span = element("span");
    			span.textContent = "Estampes";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "February 2022";
    			t4 = space();
    			p1 = element("p");
    			t5 = text("Venkat performs Debussy's ");
    			em = element("em");
    			em.textContent = "Estampes";
    			t7 = text(" at his second solo recital at CMU.");
    			attr_dev(span, "class", "fw3 ml1");
    			add_location(span, file$2, 18, 15, 557);
    			attr_dev(h3, "class", "mb0 lh-title");
    			add_location(h3, file$2, 17, 4, 516);
    			attr_dev(p0, "class", "gray mv0");
    			add_location(p0, file$2, 20, 4, 609);
    			add_location(em, file$2, 22, 32, 703);
    			attr_dev(p1, "class", "lh-copy");
    			add_location(p1, file$2, 21, 4, 651);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			append_dev(h3, span);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, t5);
    			append_dev(p1, em);
    			append_dev(p1, t7);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(p1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(14:2) <Card     url=\\\"https://www.youtube.com/watch?v=1mqnrWxZ-xw\\\"     videoSrc=\\\"https://www.youtube.com/embed/1mqnrWxZ-xw\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (26:2) <Card     url="https://www.youtube.com/watch?v=Fm-r7pBj0Us"     videoSrc="https://www.youtube.com/embed/Fm-r7pBj0Us"   >
    function create_default_slot_8(ctx) {
    	let h3;
    	let t0;
    	let span;
    	let t2;
    	let p0;
    	let t4;
    	let p1;
    	let t5;
    	let em;
    	let t7;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text("Liszt: ");
    			span = element("span");
    			span.textContent = "Mephisto Waltz No. 1";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "February 2022";
    			t4 = space();
    			p1 = element("p");
    			t5 = text("Venkat performs Liszt's ");
    			em = element("em");
    			em.textContent = "Mephisto Waltz No. 1";
    			t7 = text(" at his second solo recital\n      at CMU.");
    			attr_dev(span, "class", "fw3 ml1");
    			add_location(span, file$2, 30, 13, 941);
    			attr_dev(h3, "class", "mb0 lh-title");
    			add_location(h3, file$2, 29, 4, 902);
    			attr_dev(p0, "class", "gray mv0");
    			add_location(p0, file$2, 32, 4, 1005);
    			add_location(em, file$2, 34, 30, 1097);
    			attr_dev(p1, "class", "lh-copy");
    			add_location(p1, file$2, 33, 4, 1047);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			append_dev(h3, span);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, t5);
    			append_dev(p1, em);
    			append_dev(p1, t7);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(p1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(26:2) <Card     url=\\\"https://www.youtube.com/watch?v=Fm-r7pBj0Us\\\"     videoSrc=\\\"https://www.youtube.com/embed/Fm-r7pBj0Us\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (39:2) <Card     url="https://www.youtube.com/watch?v=AjKWi564EIY"     videoSrc="https://www.youtube.com/embed/AjKWi564EIY"   >
    function create_default_slot_7(ctx) {
    	let h3;
    	let t0;
    	let span;
    	let t2;
    	let p0;
    	let t4;
    	let p1;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text("Solo Recital ");
    			span = element("span");
    			span.textContent = "Fall 2020";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "November 2020";
    			t4 = space();
    			p1 = element("p");
    			p1.textContent = "Venkat performs sonatas by Scriabin, Beethoven, and Rachmaninoff in this\n      virtual solo recital streamed from Carnegie Mellon's Kresge Recital Hall.";
    			attr_dev(span, "class", "fw3 ml1");
    			add_location(span, file$2, 43, 19, 1359);
    			attr_dev(h3, "class", "mb0 lh-title");
    			add_location(h3, file$2, 42, 4, 1314);
    			attr_dev(p0, "class", "gray mv0");
    			add_location(p0, file$2, 45, 4, 1412);
    			attr_dev(p1, "class", "lh-copy");
    			add_location(p1, file$2, 46, 4, 1454);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			append_dev(h3, span);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, p1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(p1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(39:2) <Card     url=\\\"https://www.youtube.com/watch?v=AjKWi564EIY\\\"     videoSrc=\\\"https://www.youtube.com/embed/AjKWi564EIY\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (52:2) <Card     url="https://mta.mit.edu/video/mitso-fall-concert-live-webcast"     imageSrc="assets/mitso.png"     imageAlt="A picture of Venkat at the piano from a poster for his performance with the MIT Symphony"   >
    function create_default_slot_6(ctx) {
    	let h3;
    	let t0;
    	let span;
    	let t2;
    	let p0;
    	let t4;
    	let p1;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text("Ravel: ");
    			span = element("span");
    			span.textContent = "Piano Concerto in G";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "October 2021";
    			t4 = space();
    			p1 = element("p");
    			p1.textContent = "Venkat performs Ravel's Piano Concerto as a soloist with the MIT Symphony\n      as co-winner of the MIT Concerto Competition from 2020. Click to watch the\n      live-stream (performance starts at 20').";
    			attr_dev(span, "class", "fw3 ml1");
    			add_location(span, file$2, 57, 13, 1911);
    			attr_dev(h3, "class", "mb0 lh-title");
    			add_location(h3, file$2, 56, 4, 1872);
    			attr_dev(p0, "class", "gray mv0");
    			add_location(p0, file$2, 59, 4, 1974);
    			attr_dev(p1, "class", "lh-copy");
    			add_location(p1, file$2, 60, 4, 2015);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			append_dev(h3, span);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, p1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(p1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(52:2) <Card     url=\\\"https://mta.mit.edu/video/mitso-fall-concert-live-webcast\\\"     imageSrc=\\\"assets/mitso.png\\\"     imageAlt=\\\"A picture of Venkat at the piano from a poster for his performance with the MIT Symphony\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (67:2) <Card     url="https://www.youtube.com/watch?v=Yo6NBDNKYiM"     videoSrc="https://www.youtube.com/embed/Yo6NBDNKYiM"   >
    function create_default_slot_5(ctx) {
    	let h3;
    	let t0;
    	let span;
    	let t2;
    	let p0;
    	let t4;
    	let p1;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text("Dvorak: ");
    			span = element("span");
    			span.textContent = "Piano Trio No. 3";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "December 2019";
    			t4 = space();
    			p1 = element("p");
    			p1.textContent = "Ji Seok Kim, Taylor Safrit, and Venkatesh Sivaraman perform Dvorak's Piano\n      Trio No. 3 at MIT's Killian Hall in a Chamber Music Society concert.";
    			attr_dev(span, "class", "fw3 ml1");
    			add_location(span, file$2, 71, 14, 2429);
    			attr_dev(h3, "class", "mb0 lh-title");
    			add_location(h3, file$2, 70, 4, 2389);
    			attr_dev(p0, "class", "gray mv0");
    			add_location(p0, file$2, 73, 4, 2489);
    			attr_dev(p1, "class", "lh-copy");
    			add_location(p1, file$2, 74, 4, 2531);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			append_dev(h3, span);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, p1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(p1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(67:2) <Card     url=\\\"https://www.youtube.com/watch?v=Yo6NBDNKYiM\\\"     videoSrc=\\\"https://www.youtube.com/embed/Yo6NBDNKYiM\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (80:2) <Card     url="https://www.youtube.com/watch?v=Ulj9CzxSgwU"     videoSrc="https://www.youtube.com/embed/Ulj9CzxSgwU"   >
    function create_default_slot_4(ctx) {
    	let h3;
    	let t0;
    	let span;
    	let t2;
    	let p0;
    	let t4;
    	let p1;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text("Shulamit Ran: ");
    			span = element("span");
    			span.textContent = "Soliloquy";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "May 2019";
    			t4 = space();
    			p1 = element("p");
    			p1.textContent = "Henry Love, Taylor Safrit, and Venkatesh Sivaraman perform Soliloquy by\n      Shulamit Ran at an MIT Chamber Music Society concert.";
    			attr_dev(span, "class", "fw3 ml1");
    			add_location(span, file$2, 84, 20, 2899);
    			attr_dev(h3, "class", "mb0 lh-title");
    			add_location(h3, file$2, 83, 4, 2853);
    			attr_dev(p0, "class", "gray mv0");
    			add_location(p0, file$2, 86, 4, 2952);
    			attr_dev(p1, "class", "lh-copy");
    			add_location(p1, file$2, 87, 4, 2989);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			append_dev(h3, span);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, p1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(p1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(80:2) <Card     url=\\\"https://www.youtube.com/watch?v=Ulj9CzxSgwU\\\"     videoSrc=\\\"https://www.youtube.com/embed/Ulj9CzxSgwU\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (93:2) <Card     url="https://www.youtube.com/watch?v=sldyqayzrKw"     videoSrc="https://www.youtube.com/embed/sldyqayzrKw"   >
    function create_default_slot_3(ctx) {
    	let h3;
    	let t0;
    	let span;
    	let t2;
    	let p0;
    	let t4;
    	let p1;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text("Sivaraman: ");
    			span = element("span");
    			span.textContent = "Picasso's Dreams";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "April 2019";
    			t4 = space();
    			p1 = element("p");
    			p1.textContent = "Venkat performs his composition Picasso's Dreams at a solo recital at\n      MIT's Killian Hall.";
    			attr_dev(span, "class", "fw3 ml1");
    			add_location(span, file$2, 97, 17, 3336);
    			attr_dev(h3, "class", "mb0 lh-title");
    			add_location(h3, file$2, 96, 4, 3293);
    			attr_dev(p0, "class", "gray mv0");
    			add_location(p0, file$2, 99, 4, 3396);
    			attr_dev(p1, "class", "lh-copy");
    			add_location(p1, file$2, 100, 4, 3435);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			append_dev(h3, span);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, p1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(p1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(93:2) <Card     url=\\\"https://www.youtube.com/watch?v=sldyqayzrKw\\\"     videoSrc=\\\"https://www.youtube.com/embed/sldyqayzrKw\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (106:2) <Card     url="https://www.youtube.com/watch?v=PyQaq62N_fI"     videoSrc="https://www.youtube.com/embed/PyQaq62N_fI"   >
    function create_default_slot_2(ctx) {
    	let h3;
    	let t0;
    	let span;
    	let t2;
    	let p0;
    	let t4;
    	let p1;
    	let t5;
    	let a0;
    	let t7;
    	let a1;
    	let t9;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text("Shostakovich: ");
    			span = element("span");
    			span.textContent = "Piano Trio No. 2";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "May 2018";
    			t4 = space();
    			p1 = element("p");
    			t5 = text("Henry Love, Taylor Safrit, and Venkatesh Sivaraman perform Shostakovich's\n      second piano trio at an MIT Chamber Music Society concert in Killian Hall.\n      See also the\n      ");
    			a0 = element("a");
    			a0.textContent = "second";
    			t7 = text("\n      and\n      ");
    			a1 = element("a");
    			a1.textContent = "third/fourth";
    			t9 = text(" movements.");
    			attr_dev(span, "class", "fw3 ml1");
    			add_location(span, file$2, 110, 20, 3749);
    			attr_dev(h3, "class", "mb0 lh-title");
    			add_location(h3, file$2, 109, 4, 3703);
    			attr_dev(p0, "class", "gray mv0");
    			add_location(p0, file$2, 112, 4, 3809);
    			attr_dev(a0, "class", "link blue");
    			attr_dev(a0, "href", "https://www.youtube.com/watch?v=RUwITozfR74");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$2, 117, 6, 4052);
    			attr_dev(a1, "class", "link blue");
    			attr_dev(a1, "href", "https://www.youtube.com/watch?v=0dqsxVFovXo");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$2, 123, 6, 4198);
    			attr_dev(p1, "class", "lh-copy");
    			add_location(p1, file$2, 113, 4, 3846);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			append_dev(h3, span);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, t5);
    			append_dev(p1, a0);
    			append_dev(p1, t7);
    			append_dev(p1, a1);
    			append_dev(p1, t9);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(p1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(106:2) <Card     url=\\\"https://www.youtube.com/watch?v=PyQaq62N_fI\\\"     videoSrc=\\\"https://www.youtube.com/embed/PyQaq62N_fI\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (131:2) <Card     url="https://www.youtube.com/watch?v=PyQaq62N_fI"     videoSrc="https://www.youtube.com/embed/PyQaq62N_fI"   >
    function create_default_slot_1(ctx) {
    	let h3;
    	let t0;
    	let span;
    	let t2;
    	let p0;
    	let t4;
    	let p1;
    	let t5;
    	let em;
    	let t7;
    	let a0;
    	let t9;
    	let a1;
    	let t11;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text("Ravel: ");
    			span = element("span");
    			span.textContent = "Gaspard de la Nuit";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "March 2018";
    			t4 = space();
    			p1 = element("p");
    			t5 = text("Venkat performs the legendarily difficult ");
    			em = element("em");
    			em.textContent = "Gaspard de la Nuit";
    			t7 = text("\n      suite by Ravel at a solo recital in MIT's Killian Hall. See also the\n      ");
    			a0 = element("a");
    			a0.textContent = "second";
    			t9 = text("\n      and\n      ");
    			a1 = element("a");
    			a1.textContent = "third";
    			t11 = text(" movements.");
    			attr_dev(span, "class", "fw3 ml1");
    			add_location(span, file$2, 135, 13, 4530);
    			attr_dev(h3, "class", "mb0 lh-title");
    			add_location(h3, file$2, 134, 4, 4491);
    			attr_dev(p0, "class", "gray mv0");
    			add_location(p0, file$2, 137, 4, 4592);
    			add_location(em, file$2, 139, 48, 4699);
    			attr_dev(a0, "class", "link blue");
    			attr_dev(a0, "href", "https://www.youtube.com/watch?v=-iSp0s9zpUE");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$2, 141, 6, 4808);
    			attr_dev(a1, "class", "link blue");
    			attr_dev(a1, "href", "https://www.youtube.com/watch?v=cULwYsX6Q88");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$2, 147, 6, 4954);
    			attr_dev(p1, "class", "lh-copy");
    			add_location(p1, file$2, 138, 4, 4631);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			append_dev(h3, span);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, t5);
    			append_dev(p1, em);
    			append_dev(p1, t7);
    			append_dev(p1, a0);
    			append_dev(p1, t9);
    			append_dev(p1, a1);
    			append_dev(p1, t11);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(p1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(131:2) <Card     url=\\\"https://www.youtube.com/watch?v=PyQaq62N_fI\\\"     videoSrc=\\\"https://www.youtube.com/embed/PyQaq62N_fI\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (155:2) <Card     url="https://www.youtube.com/watch?v=sb6SReBcXUI"     videoSrc="https://www.youtube.com/embed/sb6SReBcXUI"   >
    function create_default_slot(ctx) {
    	let h3;
    	let t0;
    	let span;
    	let t2;
    	let p0;
    	let t4;
    	let p1;
    	let t5;
    	let a0;
    	let t7;
    	let a1;
    	let t9;
    	let a2;
    	let t11;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text("Ravel: ");
    			span = element("span");
    			span.textContent = "Piano Trio in A minor";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "December 2017";
    			t4 = space();
    			p1 = element("p");
    			t5 = text("Venkat performs Ravel's Piano Trio with Henry Love and Taylor Safrit. See\n      also the\n      ");
    			a0 = element("a");
    			a0.textContent = "first";
    			t7 = text(",\n      ");
    			a1 = element("a");
    			a1.textContent = "third";
    			t9 = text(", and\n      ");
    			a2 = element("a");
    			a2.textContent = "fourth";
    			t11 = text(" movements.");
    			attr_dev(span, "class", "fw3 ml1");
    			add_location(span, file$2, 159, 13, 5279);
    			attr_dev(h3, "class", "mb0 lh-title");
    			add_location(h3, file$2, 158, 4, 5240);
    			attr_dev(p0, "class", "gray mv0");
    			add_location(p0, file$2, 161, 4, 5344);
    			attr_dev(a0, "class", "link blue");
    			attr_dev(a0, "href", "https://www.youtube.com/watch?v=7Ku-EH3iPQc");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$2, 165, 6, 5507);
    			attr_dev(a1, "class", "link blue");
    			attr_dev(a1, "href", "https://www.youtube.com/watch?v=KfOMI2H7vMk");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$2, 170, 6, 5643);
    			attr_dev(a2, "class", "link blue");
    			attr_dev(a2, "href", "https://www.youtube.com/watch?v=FllN04uTW4k");
    			attr_dev(a2, "target", "_blank");
    			add_location(a2, file$2, 175, 6, 5783);
    			attr_dev(p1, "class", "lh-copy");
    			add_location(p1, file$2, 162, 4, 5386);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			append_dev(h3, span);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, t5);
    			append_dev(p1, a0);
    			append_dev(p1, t7);
    			append_dev(p1, a1);
    			append_dev(p1, t9);
    			append_dev(p1, a2);
    			append_dev(p1, t11);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(p1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(155:2) <Card     url=\\\"https://www.youtube.com/watch?v=sb6SReBcXUI\\\"     videoSrc=\\\"https://www.youtube.com/embed/sb6SReBcXUI\\\"   >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let h1;
    	let t0;
    	let span;
    	let t2;
    	let p;
    	let t4;
    	let div;
    	let card0;
    	let t5;
    	let card1;
    	let t6;
    	let card2;
    	let t7;
    	let card3;
    	let t8;
    	let card4;
    	let t9;
    	let card5;
    	let t10;
    	let card6;
    	let t11;
    	let card7;
    	let t12;
    	let card8;
    	let t13;
    	let card9;
    	let current;

    	card0 = new Card({
    			props: {
    				url: "https://www.youtube.com/watch?v=1mqnrWxZ-xw",
    				videoSrc: "https://www.youtube.com/embed/1mqnrWxZ-xw",
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card1 = new Card({
    			props: {
    				url: "https://www.youtube.com/watch?v=Fm-r7pBj0Us",
    				videoSrc: "https://www.youtube.com/embed/Fm-r7pBj0Us",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card2 = new Card({
    			props: {
    				url: "https://www.youtube.com/watch?v=AjKWi564EIY",
    				videoSrc: "https://www.youtube.com/embed/AjKWi564EIY",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card3 = new Card({
    			props: {
    				url: "https://mta.mit.edu/video/mitso-fall-concert-live-webcast",
    				imageSrc: "assets/mitso.png",
    				imageAlt: "A picture of Venkat at the piano from a poster for his performance with the MIT Symphony",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card4 = new Card({
    			props: {
    				url: "https://www.youtube.com/watch?v=Yo6NBDNKYiM",
    				videoSrc: "https://www.youtube.com/embed/Yo6NBDNKYiM",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card5 = new Card({
    			props: {
    				url: "https://www.youtube.com/watch?v=Ulj9CzxSgwU",
    				videoSrc: "https://www.youtube.com/embed/Ulj9CzxSgwU",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card6 = new Card({
    			props: {
    				url: "https://www.youtube.com/watch?v=sldyqayzrKw",
    				videoSrc: "https://www.youtube.com/embed/sldyqayzrKw",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card7 = new Card({
    			props: {
    				url: "https://www.youtube.com/watch?v=PyQaq62N_fI",
    				videoSrc: "https://www.youtube.com/embed/PyQaq62N_fI",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card8 = new Card({
    			props: {
    				url: "https://www.youtube.com/watch?v=PyQaq62N_fI",
    				videoSrc: "https://www.youtube.com/embed/PyQaq62N_fI",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card9 = new Card({
    			props: {
    				url: "https://www.youtube.com/watch?v=sb6SReBcXUI",
    				videoSrc: "https://www.youtube.com/embed/sb6SReBcXUI",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text("Venkatesh Sivaraman ");
    			span = element("span");
    			span.textContent = "Music";
    			t2 = space();
    			p = element("p");
    			p.textContent = "I have been studying piano since the age of three, and have performed solo,\n  chamber, and orchestral works with a variety of groups. See some of my recent\n  performances below!";
    			t4 = space();
    			div = element("div");
    			create_component(card0.$$.fragment);
    			t5 = space();
    			create_component(card1.$$.fragment);
    			t6 = space();
    			create_component(card2.$$.fragment);
    			t7 = space();
    			create_component(card3.$$.fragment);
    			t8 = space();
    			create_component(card4.$$.fragment);
    			t9 = space();
    			create_component(card5.$$.fragment);
    			t10 = space();
    			create_component(card6.$$.fragment);
    			t11 = space();
    			create_component(card7.$$.fragment);
    			t12 = space();
    			create_component(card8.$$.fragment);
    			t13 = space();
    			create_component(card9.$$.fragment);
    			attr_dev(span, "class", "fw2");
    			add_location(span, file$2, 5, 22, 95);
    			attr_dev(h1, "class", "mt2");
    			add_location(h1, file$2, 4, 0, 56);
    			attr_dev(p, "class", "lh-copy measure f5");
    			add_location(p, file$2, 7, 0, 132);
    			attr_dev(div, "class", "cf shift-left equal-height svelte-cc53z3");
    			add_location(div, file$2, 12, 0, 348);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			append_dev(h1, span);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(card0, div, null);
    			append_dev(div, t5);
    			mount_component(card1, div, null);
    			append_dev(div, t6);
    			mount_component(card2, div, null);
    			append_dev(div, t7);
    			mount_component(card3, div, null);
    			append_dev(div, t8);
    			mount_component(card4, div, null);
    			append_dev(div, t9);
    			mount_component(card5, div, null);
    			append_dev(div, t10);
    			mount_component(card6, div, null);
    			append_dev(div, t11);
    			mount_component(card7, div, null);
    			append_dev(div, t12);
    			mount_component(card8, div, null);
    			append_dev(div, t13);
    			mount_component(card9, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const card0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card0_changes.$$scope = { dirty, ctx };
    			}

    			card0.$set(card0_changes);
    			const card1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card1_changes.$$scope = { dirty, ctx };
    			}

    			card1.$set(card1_changes);
    			const card2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card2_changes.$$scope = { dirty, ctx };
    			}

    			card2.$set(card2_changes);
    			const card3_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card3_changes.$$scope = { dirty, ctx };
    			}

    			card3.$set(card3_changes);
    			const card4_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card4_changes.$$scope = { dirty, ctx };
    			}

    			card4.$set(card4_changes);
    			const card5_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card5_changes.$$scope = { dirty, ctx };
    			}

    			card5.$set(card5_changes);
    			const card6_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card6_changes.$$scope = { dirty, ctx };
    			}

    			card6.$set(card6_changes);
    			const card7_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card7_changes.$$scope = { dirty, ctx };
    			}

    			card7.$set(card7_changes);
    			const card8_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card8_changes.$$scope = { dirty, ctx };
    			}

    			card8.$set(card8_changes);
    			const card9_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card9_changes.$$scope = { dirty, ctx };
    			}

    			card9.$set(card9_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card0.$$.fragment, local);
    			transition_in(card1.$$.fragment, local);
    			transition_in(card2.$$.fragment, local);
    			transition_in(card3.$$.fragment, local);
    			transition_in(card4.$$.fragment, local);
    			transition_in(card5.$$.fragment, local);
    			transition_in(card6.$$.fragment, local);
    			transition_in(card7.$$.fragment, local);
    			transition_in(card8.$$.fragment, local);
    			transition_in(card9.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card0.$$.fragment, local);
    			transition_out(card1.$$.fragment, local);
    			transition_out(card2.$$.fragment, local);
    			transition_out(card3.$$.fragment, local);
    			transition_out(card4.$$.fragment, local);
    			transition_out(card5.$$.fragment, local);
    			transition_out(card6.$$.fragment, local);
    			transition_out(card7.$$.fragment, local);
    			transition_out(card8.$$.fragment, local);
    			transition_out(card9.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div);
    			destroy_component(card0);
    			destroy_component(card1);
    			destroy_component(card2);
    			destroy_component(card3);
    			destroy_component(card4);
    			destroy_component(card5);
    			destroy_component(card6);
    			destroy_component(card7);
    			destroy_component(card8);
    			destroy_component(card9);
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

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Music', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Music> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Card });
    	return [];
    }

    class Music extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Music",
    			options,
    			id: create_fragment$2.name
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

    const parseNumber = parseFloat;

    function joinCss(obj, separator = ';') {
      let texts;
      if (Array.isArray(obj)) {
        texts = obj.filter((text) => text);
      } else {
        texts = [];
        for (const prop in obj) {
          if (obj[prop]) {
            texts.push(`${prop}:${obj[prop]}`);
          }
        }
      }
      return texts.join(separator);
    }

    function getStyles(style, size, pull, fw) {
      let float;
      let width;
      const height = '1em';
      let lineHeight;
      let fontSize;
      let textAlign;
      let verticalAlign = '-.125em';
      const overflow = 'visible';

      if (fw) {
        textAlign = 'center';
        width = '1.25em';
      }

      if (pull) {
        float = pull;
      }

      if (size) {
        if (size == 'lg') {
          fontSize = '1.33333em';
          lineHeight = '.75em';
          verticalAlign = '-.225em';
        } else if (size == 'xs') {
          fontSize = '.75em';
        } else if (size == 'sm') {
          fontSize = '.875em';
        } else {
          fontSize = size.replace('x', 'em');
        }
      }

      return joinCss([
        joinCss({
          float,
          width,
          height,
          'line-height': lineHeight,
          'font-size': fontSize,
          'text-align': textAlign,
          'vertical-align': verticalAlign,
          'transform-origin': 'center',
          overflow,
        }),
        style,
      ]);
    }

    function getTransform(
      scale,
      translateX,
      translateY,
      rotate,
      flip,
      translateTimes = 1,
      translateUnit = '',
      rotateUnit = '',
    ) {
      let flipX = 1;
      let flipY = 1;

      if (flip) {
        if (flip == 'horizontal') {
          flipX = -1;
        } else if (flip == 'vertical') {
          flipY = -1;
        } else {
          flipX = flipY = -1;
        }
      }

      return joinCss(
        [
          `translate(${parseNumber(translateX) * translateTimes}${translateUnit},${parseNumber(translateY) * translateTimes}${translateUnit})`,
          `scale(${flipX * parseNumber(scale)},${flipY * parseNumber(scale)})`,
          rotate && `rotate(${rotate}${rotateUnit})`,
        ],
        ' ',
      );
    }

    /* node_modules/svelte-fa/src/fa.svelte generated by Svelte v3.46.3 */
    const file$1 = "node_modules/svelte-fa/src/fa.svelte";

    // (78:0) {#if i[4]}
    function create_if_block$1(ctx) {
    	let svg;
    	let g1;
    	let g0;
    	let g1_transform_value;
    	let g1_transform_origin_value;
    	let svg_class_value;
    	let svg_viewBox_value;

    	function select_block_type(ctx, dirty) {
    		if (typeof /*i*/ ctx[7][4] == 'string') return create_if_block_1$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			if_block.c();
    			attr_dev(g0, "transform", /*transform*/ ctx[10]);
    			add_location(g0, file$1, 91, 6, 1469);
    			attr_dev(g1, "transform", g1_transform_value = `translate(${/*i*/ ctx[7][0] / 2} ${/*i*/ ctx[7][1] / 2})`);
    			attr_dev(g1, "transform-origin", g1_transform_origin_value = `${/*i*/ ctx[7][0] / 4} 0`);
    			add_location(g1, file$1, 87, 4, 1358);
    			attr_dev(svg, "id", /*id*/ ctx[0]);
    			attr_dev(svg, "class", svg_class_value = "" + (null_to_empty(/*c*/ ctx[8]) + " svelte-1cj2gr0"));
    			attr_dev(svg, "style", /*s*/ ctx[9]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = `0 0 ${/*i*/ ctx[7][0]} ${/*i*/ ctx[7][1]}`);
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "role", "img");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$1, 78, 2, 1195);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			if_block.m(g0, null);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(g0, null);
    				}
    			}

    			if (dirty & /*transform*/ 1024) {
    				attr_dev(g0, "transform", /*transform*/ ctx[10]);
    			}

    			if (dirty & /*i*/ 128 && g1_transform_value !== (g1_transform_value = `translate(${/*i*/ ctx[7][0] / 2} ${/*i*/ ctx[7][1] / 2})`)) {
    				attr_dev(g1, "transform", g1_transform_value);
    			}

    			if (dirty & /*i*/ 128 && g1_transform_origin_value !== (g1_transform_origin_value = `${/*i*/ ctx[7][0] / 4} 0`)) {
    				attr_dev(g1, "transform-origin", g1_transform_origin_value);
    			}

    			if (dirty & /*id*/ 1) {
    				attr_dev(svg, "id", /*id*/ ctx[0]);
    			}

    			if (dirty & /*c*/ 256 && svg_class_value !== (svg_class_value = "" + (null_to_empty(/*c*/ ctx[8]) + " svelte-1cj2gr0"))) {
    				attr_dev(svg, "class", svg_class_value);
    			}

    			if (dirty & /*s*/ 512) {
    				attr_dev(svg, "style", /*s*/ ctx[9]);
    			}

    			if (dirty & /*i*/ 128 && svg_viewBox_value !== (svg_viewBox_value = `0 0 ${/*i*/ ctx[7][0]} ${/*i*/ ctx[7][1]}`)) {
    				attr_dev(svg, "viewBox", svg_viewBox_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(78:0) {#if i[4]}",
    		ctx
    	});

    	return block;
    }

    // (99:8) {:else}
    function create_else_block(ctx) {
    	let path0;
    	let path0_d_value;
    	let path0_fill_value;
    	let path0_fill_opacity_value;
    	let path0_transform_value;
    	let path1;
    	let path1_d_value;
    	let path1_fill_value;
    	let path1_fill_opacity_value;
    	let path1_transform_value;

    	const block = {
    		c: function create() {
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", path0_d_value = /*i*/ ctx[7][4][0]);
    			attr_dev(path0, "fill", path0_fill_value = /*secondaryColor*/ ctx[3] || /*color*/ ctx[1] || 'currentColor');

    			attr_dev(path0, "fill-opacity", path0_fill_opacity_value = /*swapOpacity*/ ctx[6] != false
    			? /*primaryOpacity*/ ctx[4]
    			: /*secondaryOpacity*/ ctx[5]);

    			attr_dev(path0, "transform", path0_transform_value = `translate(${/*i*/ ctx[7][0] / -2} ${/*i*/ ctx[7][1] / -2})`);
    			add_location(path0, file$1, 99, 10, 1721);
    			attr_dev(path1, "d", path1_d_value = /*i*/ ctx[7][4][1]);
    			attr_dev(path1, "fill", path1_fill_value = /*primaryColor*/ ctx[2] || /*color*/ ctx[1] || 'currentColor');

    			attr_dev(path1, "fill-opacity", path1_fill_opacity_value = /*swapOpacity*/ ctx[6] != false
    			? /*secondaryOpacity*/ ctx[5]
    			: /*primaryOpacity*/ ctx[4]);

    			attr_dev(path1, "transform", path1_transform_value = `translate(${/*i*/ ctx[7][0] / -2} ${/*i*/ ctx[7][1] / -2})`);
    			add_location(path1, file$1, 105, 10, 1982);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path0, anchor);
    			insert_dev(target, path1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*i*/ 128 && path0_d_value !== (path0_d_value = /*i*/ ctx[7][4][0])) {
    				attr_dev(path0, "d", path0_d_value);
    			}

    			if (dirty & /*secondaryColor, color*/ 10 && path0_fill_value !== (path0_fill_value = /*secondaryColor*/ ctx[3] || /*color*/ ctx[1] || 'currentColor')) {
    				attr_dev(path0, "fill", path0_fill_value);
    			}

    			if (dirty & /*swapOpacity, primaryOpacity, secondaryOpacity*/ 112 && path0_fill_opacity_value !== (path0_fill_opacity_value = /*swapOpacity*/ ctx[6] != false
    			? /*primaryOpacity*/ ctx[4]
    			: /*secondaryOpacity*/ ctx[5])) {
    				attr_dev(path0, "fill-opacity", path0_fill_opacity_value);
    			}

    			if (dirty & /*i*/ 128 && path0_transform_value !== (path0_transform_value = `translate(${/*i*/ ctx[7][0] / -2} ${/*i*/ ctx[7][1] / -2})`)) {
    				attr_dev(path0, "transform", path0_transform_value);
    			}

    			if (dirty & /*i*/ 128 && path1_d_value !== (path1_d_value = /*i*/ ctx[7][4][1])) {
    				attr_dev(path1, "d", path1_d_value);
    			}

    			if (dirty & /*primaryColor, color*/ 6 && path1_fill_value !== (path1_fill_value = /*primaryColor*/ ctx[2] || /*color*/ ctx[1] || 'currentColor')) {
    				attr_dev(path1, "fill", path1_fill_value);
    			}

    			if (dirty & /*swapOpacity, secondaryOpacity, primaryOpacity*/ 112 && path1_fill_opacity_value !== (path1_fill_opacity_value = /*swapOpacity*/ ctx[6] != false
    			? /*secondaryOpacity*/ ctx[5]
    			: /*primaryOpacity*/ ctx[4])) {
    				attr_dev(path1, "fill-opacity", path1_fill_opacity_value);
    			}

    			if (dirty & /*i*/ 128 && path1_transform_value !== (path1_transform_value = `translate(${/*i*/ ctx[7][0] / -2} ${/*i*/ ctx[7][1] / -2})`)) {
    				attr_dev(path1, "transform", path1_transform_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path0);
    			if (detaching) detach_dev(path1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(99:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (93:8) {#if typeof i[4] == 'string'}
    function create_if_block_1$1(ctx) {
    	let path;
    	let path_d_value;
    	let path_fill_value;
    	let path_transform_value;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", path_d_value = /*i*/ ctx[7][4]);
    			attr_dev(path, "fill", path_fill_value = /*color*/ ctx[1] || /*primaryColor*/ ctx[2] || 'currentColor');
    			attr_dev(path, "transform", path_transform_value = `translate(${/*i*/ ctx[7][0] / -2} ${/*i*/ ctx[7][1] / -2})`);
    			add_location(path, file$1, 93, 10, 1533);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*i*/ 128 && path_d_value !== (path_d_value = /*i*/ ctx[7][4])) {
    				attr_dev(path, "d", path_d_value);
    			}

    			if (dirty & /*color, primaryColor*/ 6 && path_fill_value !== (path_fill_value = /*color*/ ctx[1] || /*primaryColor*/ ctx[2] || 'currentColor')) {
    				attr_dev(path, "fill", path_fill_value);
    			}

    			if (dirty & /*i*/ 128 && path_transform_value !== (path_transform_value = `translate(${/*i*/ ctx[7][0] / -2} ${/*i*/ ctx[7][1] / -2})`)) {
    				attr_dev(path, "transform", path_transform_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(93:8) {#if typeof i[4] == 'string'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let if_block_anchor;
    	let if_block = /*i*/ ctx[7][4] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*i*/ ctx[7][4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Fa', slots, []);
    	let { class: clazz = '' } = $$props;
    	let { id = '' } = $$props;
    	let { style = '' } = $$props;
    	let { icon } = $$props;
    	let { size = '' } = $$props;
    	let { color = '' } = $$props;
    	let { fw = false } = $$props;
    	let { pull = '' } = $$props;
    	let { scale = 1 } = $$props;
    	let { translateX = 0 } = $$props;
    	let { translateY = 0 } = $$props;
    	let { rotate = '' } = $$props;
    	let { flip = false } = $$props;
    	let { spin = false } = $$props;
    	let { pulse = false } = $$props;
    	let { primaryColor = '' } = $$props;
    	let { secondaryColor = '' } = $$props;
    	let { primaryOpacity = 1 } = $$props;
    	let { secondaryOpacity = 0.4 } = $$props;
    	let { swapOpacity = false } = $$props;
    	let i;
    	let c;
    	let s;
    	let transform;

    	const writable_props = [
    		'class',
    		'id',
    		'style',
    		'icon',
    		'size',
    		'color',
    		'fw',
    		'pull',
    		'scale',
    		'translateX',
    		'translateY',
    		'rotate',
    		'flip',
    		'spin',
    		'pulse',
    		'primaryColor',
    		'secondaryColor',
    		'primaryOpacity',
    		'secondaryOpacity',
    		'swapOpacity'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Fa> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(11, clazz = $$props.class);
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('style' in $$props) $$invalidate(12, style = $$props.style);
    		if ('icon' in $$props) $$invalidate(13, icon = $$props.icon);
    		if ('size' in $$props) $$invalidate(14, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    		if ('fw' in $$props) $$invalidate(15, fw = $$props.fw);
    		if ('pull' in $$props) $$invalidate(16, pull = $$props.pull);
    		if ('scale' in $$props) $$invalidate(17, scale = $$props.scale);
    		if ('translateX' in $$props) $$invalidate(18, translateX = $$props.translateX);
    		if ('translateY' in $$props) $$invalidate(19, translateY = $$props.translateY);
    		if ('rotate' in $$props) $$invalidate(20, rotate = $$props.rotate);
    		if ('flip' in $$props) $$invalidate(21, flip = $$props.flip);
    		if ('spin' in $$props) $$invalidate(22, spin = $$props.spin);
    		if ('pulse' in $$props) $$invalidate(23, pulse = $$props.pulse);
    		if ('primaryColor' in $$props) $$invalidate(2, primaryColor = $$props.primaryColor);
    		if ('secondaryColor' in $$props) $$invalidate(3, secondaryColor = $$props.secondaryColor);
    		if ('primaryOpacity' in $$props) $$invalidate(4, primaryOpacity = $$props.primaryOpacity);
    		if ('secondaryOpacity' in $$props) $$invalidate(5, secondaryOpacity = $$props.secondaryOpacity);
    		if ('swapOpacity' in $$props) $$invalidate(6, swapOpacity = $$props.swapOpacity);
    	};

    	$$self.$capture_state = () => ({
    		joinCss,
    		getStyles,
    		getTransform,
    		clazz,
    		id,
    		style,
    		icon,
    		size,
    		color,
    		fw,
    		pull,
    		scale,
    		translateX,
    		translateY,
    		rotate,
    		flip,
    		spin,
    		pulse,
    		primaryColor,
    		secondaryColor,
    		primaryOpacity,
    		secondaryOpacity,
    		swapOpacity,
    		i,
    		c,
    		s,
    		transform
    	});

    	$$self.$inject_state = $$props => {
    		if ('clazz' in $$props) $$invalidate(11, clazz = $$props.clazz);
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('style' in $$props) $$invalidate(12, style = $$props.style);
    		if ('icon' in $$props) $$invalidate(13, icon = $$props.icon);
    		if ('size' in $$props) $$invalidate(14, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    		if ('fw' in $$props) $$invalidate(15, fw = $$props.fw);
    		if ('pull' in $$props) $$invalidate(16, pull = $$props.pull);
    		if ('scale' in $$props) $$invalidate(17, scale = $$props.scale);
    		if ('translateX' in $$props) $$invalidate(18, translateX = $$props.translateX);
    		if ('translateY' in $$props) $$invalidate(19, translateY = $$props.translateY);
    		if ('rotate' in $$props) $$invalidate(20, rotate = $$props.rotate);
    		if ('flip' in $$props) $$invalidate(21, flip = $$props.flip);
    		if ('spin' in $$props) $$invalidate(22, spin = $$props.spin);
    		if ('pulse' in $$props) $$invalidate(23, pulse = $$props.pulse);
    		if ('primaryColor' in $$props) $$invalidate(2, primaryColor = $$props.primaryColor);
    		if ('secondaryColor' in $$props) $$invalidate(3, secondaryColor = $$props.secondaryColor);
    		if ('primaryOpacity' in $$props) $$invalidate(4, primaryOpacity = $$props.primaryOpacity);
    		if ('secondaryOpacity' in $$props) $$invalidate(5, secondaryOpacity = $$props.secondaryOpacity);
    		if ('swapOpacity' in $$props) $$invalidate(6, swapOpacity = $$props.swapOpacity);
    		if ('i' in $$props) $$invalidate(7, i = $$props.i);
    		if ('c' in $$props) $$invalidate(8, c = $$props.c);
    		if ('s' in $$props) $$invalidate(9, s = $$props.s);
    		if ('transform' in $$props) $$invalidate(10, transform = $$props.transform);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*icon*/ 8192) {
    			$$invalidate(7, i = icon && icon.icon || [0, 0, '', [], '']);
    		}

    		if ($$self.$$.dirty & /*clazz, spin, pulse*/ 12584960) {
    			$$invalidate(8, c = joinCss([clazz, 'svelte-fa', spin && 'spin', pulse && 'pulse'], ' '));
    		}

    		if ($$self.$$.dirty & /*style, size, pull, fw*/ 118784) {
    			$$invalidate(9, s = getStyles(style, size, pull, fw));
    		}

    		if ($$self.$$.dirty & /*scale, translateX, translateY, rotate, flip*/ 4063232) {
    			$$invalidate(10, transform = getTransform(scale, translateX, translateY, rotate, flip, 512));
    		}
    	};

    	return [
    		id,
    		color,
    		primaryColor,
    		secondaryColor,
    		primaryOpacity,
    		secondaryOpacity,
    		swapOpacity,
    		i,
    		c,
    		s,
    		transform,
    		clazz,
    		style,
    		icon,
    		size,
    		fw,
    		pull,
    		scale,
    		translateX,
    		translateY,
    		rotate,
    		flip,
    		spin,
    		pulse
    	];
    }

    class Fa extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			class: 11,
    			id: 0,
    			style: 12,
    			icon: 13,
    			size: 14,
    			color: 1,
    			fw: 15,
    			pull: 16,
    			scale: 17,
    			translateX: 18,
    			translateY: 19,
    			rotate: 20,
    			flip: 21,
    			spin: 22,
    			pulse: 23,
    			primaryColor: 2,
    			secondaryColor: 3,
    			primaryOpacity: 4,
    			secondaryOpacity: 5,
    			swapOpacity: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Fa",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*icon*/ ctx[13] === undefined && !('icon' in props)) {
    			console.warn("<Fa> was created without expected prop 'icon'");
    		}
    	}

    	get class() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fw() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fw(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pull() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pull(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scale() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scale(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get translateX() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set translateX(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get translateY() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set translateY(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rotate() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rotate(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flip() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flip(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spin() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spin(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pulse() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pulse(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primaryColor() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primaryColor(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get secondaryColor() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set secondaryColor(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primaryOpacity() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primaryOpacity(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get secondaryOpacity() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set secondaryOpacity(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get swapOpacity() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set swapOpacity(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /*!
     * Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com
     * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
     */
    var faEnvelope = {
      prefix: 'fas',
      iconName: 'envelope',
      icon: [512, 512, [], "f0e0", "M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"]
    };

    /*!
     * Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com
     * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
     */
    var faGithub = {
      prefix: 'fab',
      iconName: 'github',
      icon: [496, 512, [], "f09b", "M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"]
    };

    /* src/App.svelte generated by Svelte v3.46.3 */

    const { console: console_1 } = globals;
    const file = "src/App.svelte";

    // (149:29) 
    function create_if_block_4(ctx) {
    	let div;
    	let music;
    	let t0;
    	let footer;
    	let div_intro;
    	let div_outro;
    	let current;
    	let mounted;
    	let dispose;
    	music = new Music({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(music.$$.fragment);
    			t0 = space();
    			footer = element("footer");
    			footer.textContent = "Copyright 2022 Venkatesh Sivaraman.";
    			attr_dev(footer, "class", "gray svelte-mgyksa");
    			add_location(footer, file, 156, 6, 4400);
    			attr_dev(div, "class", "document svelte-mgyksa");
    			add_location(div, file, 149, 4, 4212);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(music, div, null);
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
    			transition_in(music.$$.fragment, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, /*fadeAndSlide*/ ctx[4], { above: 4 < /*oldTab*/ ctx[2] });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(music.$$.fragment, local);
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, /*fadeAndSlide*/ ctx[4], { above: /*newTab*/ ctx[0] > 4 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(music);
    			if (detaching && div_outro) div_outro.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(149:29) ",
    		ctx
    	});

    	return block;
    }

    // (139:29) 
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
    			attr_dev(footer, "class", "gray svelte-mgyksa");
    			add_location(footer, file, 146, 6, 4101);
    			attr_dev(div, "class", "document svelte-mgyksa");
    			add_location(div, file, 139, 4, 3908);
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
    		source: "(139:29) ",
    		ctx
    	});

    	return block;
    }

    // (129:29) 
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
    			attr_dev(footer, "class", "gray svelte-mgyksa");
    			add_location(footer, file, 136, 6, 3797);
    			attr_dev(div, "class", "document svelte-mgyksa");
    			add_location(div, file, 129, 4, 3602);
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
    		source: "(129:29) ",
    		ctx
    	});

    	return block;
    }

    // (119:29) 
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
    			attr_dev(footer, "class", "gray svelte-mgyksa");
    			add_location(footer, file, 126, 6, 3491);
    			attr_dev(div, "class", "document svelte-mgyksa");
    			add_location(div, file, 119, 4, 3300);
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
    		source: "(119:29) ",
    		ctx
    	});

    	return block;
    }

    // (109:2) {#if $visibleTab == 0}
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
    	about.$on("projects", /*projects_handler*/ ctx[12]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(about.$$.fragment);
    			t0 = space();
    			footer = element("footer");
    			footer.textContent = "Copyright 2022 Venkatesh Sivaraman.";
    			attr_dev(footer, "class", "gray svelte-mgyksa");
    			add_location(footer, file, 116, 6, 3189);
    			attr_dev(div, "class", "document svelte-mgyksa");
    			add_location(div, file, 109, 4, 2968);
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
    		source: "(109:2) {#if $visibleTab == 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let aside;
    	let div;
    	let img;
    	let img_src_value;
    	let t0;
    	let ul;
    	let li0;
    	let a0;
    	let t2;
    	let li1;
    	let a1;
    	let t4;
    	let li2;
    	let a2;
    	let t6;
    	let li3;
    	let a3;
    	let t8;
    	let li4;
    	let a4;
    	let t10;
    	let li5;
    	let a5;
    	let fa0;
    	let t11;
    	let t12;
    	let li6;
    	let a6;
    	let fa1;
    	let t13;
    	let t14;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;

    	fa0 = new Fa({
    			props: { icon: faGithub },
    			$$inline: true
    		});

    	fa1 = new Fa({
    			props: { icon: faEnvelope },
    			$$inline: true
    		});

    	const if_block_creators = [
    		create_if_block,
    		create_if_block_1,
    		create_if_block_2,
    		create_if_block_3,
    		create_if_block_4
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$visibleTab*/ ctx[1] == 0) return 0;
    		if (/*$visibleTab*/ ctx[1] == 1) return 1;
    		if (/*$visibleTab*/ ctx[1] == 2) return 2;
    		if (/*$visibleTab*/ ctx[1] == 3) return 3;
    		if (/*$visibleTab*/ ctx[1] == 4) return 4;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			aside = element("aside");
    			div = element("div");
    			img = element("img");
    			t0 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "About";
    			t2 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Projects";
    			t4 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Publications";
    			t6 = space();
    			li3 = element("li");
    			a3 = element("a");
    			a3.textContent = "Experience";
    			t8 = space();
    			li4 = element("li");
    			a4 = element("a");
    			a4.textContent = "Music";
    			t10 = space();
    			li5 = element("li");
    			a5 = element("a");
    			create_component(fa0.$$.fragment);
    			t11 = text("    GitHub");
    			t12 = space();
    			li6 = element("li");
    			a6 = element("a");
    			create_component(fa1.$$.fragment);
    			t13 = text("    Contact");
    			t14 = space();
    			if (if_block) if_block.c();
    			attr_dev(img, "class", "profile-pic dim pointer svelte-mgyksa");
    			if (!src_url_equal(img.src, img_src_value = "assets/profile.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Picture of Venkat in Cambridge, Massachusetts");
    			add_location(img, file, 45, 6, 1171);
    			attr_dev(a0, "class", "svelte-mgyksa");
    			toggle_class(a0, "active-link", /*$visibleTab*/ ctx[1] == 0);
    			toggle_class(a0, "link", /*$visibleTab*/ ctx[1] != 0);
    			add_location(a0, file, 53, 10, 1416);
    			attr_dev(li0, "class", "svelte-mgyksa");
    			add_location(li0, file, 52, 8, 1401);
    			attr_dev(a1, "class", "svelte-mgyksa");
    			toggle_class(a1, "active-link", /*$visibleTab*/ ctx[1] == 1);
    			toggle_class(a1, "link", /*$visibleTab*/ ctx[1] != 1);
    			add_location(a1, file, 60, 10, 1610);
    			attr_dev(li1, "class", "svelte-mgyksa");
    			add_location(li1, file, 59, 8, 1595);
    			attr_dev(a2, "class", "svelte-mgyksa");
    			toggle_class(a2, "active-link", /*$visibleTab*/ ctx[1] == 2);
    			toggle_class(a2, "link", /*$visibleTab*/ ctx[1] != 2);
    			add_location(a2, file, 67, 10, 1807);
    			attr_dev(li2, "class", "svelte-mgyksa");
    			add_location(li2, file, 66, 8, 1792);
    			attr_dev(a3, "class", "svelte-mgyksa");
    			toggle_class(a3, "active-link", /*$visibleTab*/ ctx[1] == 3);
    			toggle_class(a3, "link", /*$visibleTab*/ ctx[1] != 3);
    			add_location(a3, file, 74, 10, 2008);
    			attr_dev(li3, "class", "svelte-mgyksa");
    			add_location(li3, file, 73, 8, 1993);
    			attr_dev(a4, "class", "svelte-mgyksa");
    			toggle_class(a4, "active-link", /*$visibleTab*/ ctx[1] == 4);
    			toggle_class(a4, "link", /*$visibleTab*/ ctx[1] != 4);
    			add_location(a4, file, 81, 10, 2207);
    			attr_dev(li4, "class", "svelte-mgyksa");
    			add_location(li4, file, 80, 8, 2192);
    			attr_dev(a5, "class", "link contact-link flex items-center svelte-mgyksa");
    			attr_dev(a5, "href", "https://github.com/venkatesh-sivaraman");
    			attr_dev(a5, "target", "_blank");
    			add_location(a5, file, 88, 10, 2413);
    			attr_dev(li5, "class", "mt1 svelte-mgyksa");
    			add_location(li5, file, 87, 8, 2386);
    			attr_dev(a6, "class", "link contact-link flex items-center svelte-mgyksa");
    			attr_dev(a6, "href", "mailto:venkats@cmu.edu");
    			attr_dev(a6, "target", "_blank");
    			add_location(a6, file, 97, 10, 2677);
    			attr_dev(li6, "class", "svelte-mgyksa");
    			add_location(li6, file, 96, 8, 2662);
    			attr_dev(ul, "class", "list nav-list pl0 svelte-mgyksa");
    			add_location(ul, file, 51, 6, 1362);
    			attr_dev(div, "class", "nav-container svelte-mgyksa");
    			add_location(div, file, 44, 4, 1137);
    			attr_dev(aside, "class", "svelte-mgyksa");
    			add_location(aside, file, 43, 2, 1125);
    			attr_dev(main, "class", "sans-serif svelte-mgyksa");
    			add_location(main, file, 42, 0, 1097);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, aside);
    			append_dev(aside, div);
    			append_dev(div, img);
    			append_dev(div, t0);
    			append_dev(div, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t2);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(ul, t4);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(ul, t6);
    			append_dev(ul, li3);
    			append_dev(li3, a3);
    			append_dev(ul, t8);
    			append_dev(ul, li4);
    			append_dev(li4, a4);
    			append_dev(ul, t10);
    			append_dev(ul, li5);
    			append_dev(li5, a5);
    			mount_component(fa0, a5, null);
    			append_dev(a5, t11);
    			append_dev(ul, t12);
    			append_dev(ul, li6);
    			append_dev(li6, a6);
    			mount_component(fa1, a6, null);
    			append_dev(a6, t13);
    			append_dev(main, t14);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(main, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(img, "click", /*click_handler*/ ctx[6], false, false, false),
    					listen_dev(a0, "click", /*click_handler_1*/ ctx[7], false, false, false),
    					listen_dev(a1, "click", /*click_handler_2*/ ctx[8], false, false, false),
    					listen_dev(a2, "click", /*click_handler_3*/ ctx[9], false, false, false),
    					listen_dev(a3, "click", /*click_handler_4*/ ctx[10], false, false, false),
    					listen_dev(a4, "click", /*click_handler_5*/ ctx[11], false, false, false)
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

    			if (dirty & /*$visibleTab*/ 2) {
    				toggle_class(a4, "active-link", /*$visibleTab*/ ctx[1] == 4);
    			}

    			if (dirty & /*$visibleTab*/ 2) {
    				toggle_class(a4, "link", /*$visibleTab*/ ctx[1] != 4);
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
    			transition_in(fa0.$$.fragment, local);
    			transition_in(fa1.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fa0.$$.fragment, local);
    			transition_out(fa1.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(fa0);
    			destroy_component(fa1);

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
    	const click_handler_1 = () => $$invalidate(0, newTab = 0);
    	const click_handler_2 = () => $$invalidate(0, newTab = 1);
    	const click_handler_3 = () => $$invalidate(0, newTab = 2);
    	const click_handler_4 = () => $$invalidate(0, newTab = 3);
    	const click_handler_5 = () => $$invalidate(0, newTab = 4);
    	const projects_handler = () => $$invalidate(0, newTab = 1);

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(5, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({
    		cubicInOut,
    		About,
    		Experience,
    		Projects,
    		Publications,
    		Music,
    		statefulSwap,
    		Fa,
    		faEnvelope,
    		faGithub,
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
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		projects_handler
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
