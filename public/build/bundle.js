
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
    	let t7;
    	let p1;
    	let t8;
    	let span0;
    	let t10;
    	let span1;
    	let t12;
    	let a2;
    	let t14;
    	let t15;
    	let p2;
    	let t16;
    	let a3;
    	let t18;
    	let t19;
    	let div2;
    	let a7;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t20;
    	let p3;
    	let span2;
    	let t22;
    	let span3;
    	let t24;
    	let p4;
    	let a4;
    	let t26;
    	let a5;
    	let t28;
    	let a6;
    	let t30;
    	let a11;
    	let div1;
    	let img1;
    	let img1_src_value;
    	let t31;
    	let p5;
    	let span4;
    	let t33;
    	let span5;
    	let t35;
    	let p6;
    	let a8;
    	let t37;
    	let a9;
    	let t39;
    	let a10;
    	let t41;
    	let p7;
    	let t42;
    	let a12;
    	let t44;
    	let t45;
    	let p8;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Venkatesh Sivaraman";
    			t1 = space();
    			p0 = element("p");
    			t2 = text("Hi, I'm Venkat! 👋🏾 I'm currently a postdoctoral scholar at UC San Francisco,\n  supervised by ");
    			a0 = element("a");
    			a0.textContent = "Jean Feng";
    			t4 = text("\n  and\n  ");
    			a1 = element("a");
    			a1.textContent = "Julian Hong";
    			t6 = text(". I am on the job market seeking academic and industry positions to begin in\n  2027.");
    			t7 = space();
    			p1 = element("p");
    			t8 = text("My research focuses on\n  ");
    			span0 = element("span");
    			span0.textContent = "building and evaluating human-centered AI tools for clinical reasoning and\n    research";
    			t10 = text(". I use behavioral psychology, data mining and visualization, and qualitative\n  research methods to\n  ");
    			span1 = element("span");
    			span1.textContent = "design real systems with clinical impact";
    			t12 = text(". I received\n  my PhD from the Human-Computer Interaction Institute at Carnegie Mellon\n  University, advised by\n  ");
    			a2 = element("a");
    			a2.textContent = "Adam Perer";
    			t14 = text(".");
    			t15 = space();
    			p2 = element("p");
    			t16 = text("Some of my recent work includes tools for model developers and clinicians to\n  work with complex patient health records (");
    			a3 = element("a");
    			a3.textContent = "see more projects";
    			t18 = text("):");
    			t19 = space();
    			div2 = element("div");
    			a7 = element("a");
    			div0 = element("div");
    			img0 = element("img");
    			t20 = space();
    			p3 = element("p");
    			span2 = element("span");
    			span2.textContent = "Libretto:";
    			t22 = space();
    			span3 = element("span");
    			span3.textContent = "Interactive LLM Chart Abstraction";
    			t24 = space();
    			p4 = element("p");
    			a4 = element("a");
    			a4.textContent = "GitHub";
    			t26 = space();
    			a5 = element("a");
    			a5.textContent = "Preprint";
    			t28 = space();
    			a6 = element("a");
    			a6.textContent = "Demo";
    			t30 = space();
    			a11 = element("a");
    			div1 = element("div");
    			img1 = element("img");
    			t31 = space();
    			p5 = element("p");
    			span4 = element("span");
    			span4.textContent = "TempoQL:";
    			t33 = space();
    			span5 = element("span");
    			span5.textContent = "Readable and Precise Queries on EHR Data";
    			t35 = space();
    			p6 = element("p");
    			a8 = element("a");
    			a8.textContent = "GitHub";
    			t37 = space();
    			a9 = element("a");
    			a9.textContent = "Preprint";
    			t39 = space();
    			a10 = element("a");
    			a10.textContent = "Demo";
    			t41 = space();
    			p7 = element("p");
    			t42 = text("For more information, please see my ");
    			a12 = element("a");
    			a12.textContent = "CV";
    			t44 = text(".");
    			t45 = space();
    			p8 = element("p");
    			p8.textContent = "I would love to chat about research and collaboration opportunities! Contact\n  me at venkatesh.sivaraman [at] ucsf [dot] edu.";
    			attr_dev(h1, "class", "mt2");
    			add_location(h1, file$7, 6, 0, 115);
    			attr_dev(a0, "class", "link blue dim");
    			attr_dev(a0, "href", "http://jeanfeng.com/");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$7, 9, 16, 289);
    			attr_dev(a1, "class", "link blue dim");
    			attr_dev(a1, "href", "https://honglab.ucsf.edu");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$7, 15, 2, 395);
    			attr_dev(p0, "class", "lh-copy f3 measure-wide");
    			add_location(p0, file$7, 7, 0, 156);
    			attr_dev(span0, "class", "fw6");
    			add_location(span0, file$7, 22, 2, 644);
    			attr_dev(span1, "class", "fw6");
    			add_location(span1, file$7, 27, 2, 866);
    			attr_dev(a2, "class", "link blue dim");
    			attr_dev(a2, "href", "https://perer.org");
    			attr_dev(a2, "target", "_blank");
    			add_location(a2, file$7, 30, 2, 1045);
    			attr_dev(p1, "class", "lh-copy f3 measure-wide");
    			add_location(p1, file$7, 20, 0, 581);
    			attr_dev(a3, "class", "link blue");
    			attr_dev(a3, "href", "#");
    			add_location(a3, file$7, 36, 44, 1299);
    			attr_dev(p2, "class", "lh-copy f4 measure-wide");
    			add_location(p2, file$7, 34, 0, 1140);
    			if (!src_url_equal(img0.src, img0_src_value = "assets/libretto.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Screenshot of Libretto being used to evaluate extractions of tumor stage and grade from oncology notes.");
    			attr_dev(img0, "class", "svelte-109nu0e");
    			add_location(img0, file$7, 51, 6, 1697);
    			attr_dev(span2, "class", "b");
    			add_location(span2, file$7, 56, 8, 1892);
    			attr_dev(span3, "class", "fw3");
    			add_location(span3, file$7, 57, 8, 1933);
    			attr_dev(p3, "class", "f5");
    			add_location(p3, file$7, 55, 6, 1869);
    			attr_dev(a4, "class", "f6 link dim ph3 pv2 dib white bg-black");
    			attr_dev(a4, "href", "https://github.com/weill-cancer-hub-west-impact-ai/libretto");
    			attr_dev(a4, "target", "_blank");
    			add_location(a4, file$7, 60, 8, 2021);
    			attr_dev(a5, "class", "f6 link dim ph3 pv2 dib white bg-black");
    			attr_dev(a5, "href", "https://arxiv.org/abs/2609.19318");
    			attr_dev(a5, "target", "_blank");
    			add_location(a5, file$7, 65, 8, 2212);
    			attr_dev(a6, "class", "f6 link dim ph3 pv2 dib white bg-black");
    			attr_dev(a6, "href", "https://libretto-demo.uw.r.appspot.com/");
    			attr_dev(a6, "target", "_blank");
    			add_location(a6, file$7, 70, 8, 2378);
    			add_location(p4, file$7, 59, 6, 2009);
    			attr_dev(div0, "class", "project-preview flex flex-column pa2 mr2 bg-animate hover-bg-near-white svelte-109nu0e");
    			add_location(div0, file$7, 48, 4, 1594);
    			attr_dev(a7, "class", "link black mr2 svelte-109nu0e");
    			attr_dev(a7, "href", "http://github.com/weill-cancer-hub-west-impact-ai/libretto");
    			attr_dev(a7, "target", "_blank");
    			add_location(a7, file$7, 43, 2, 1466);
    			if (!src_url_equal(img1.src, img1_src_value = "assets/tempoql.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Screenshot of TempoQL being used to extract data from the MIMIC dataset");
    			attr_dev(img1, "class", "svelte-109nu0e");
    			add_location(img1, file$7, 86, 6, 2780);
    			attr_dev(span4, "class", "b");
    			add_location(span4, file$7, 91, 8, 2942);
    			attr_dev(span5, "class", "fw3");
    			add_location(span5, file$7, 92, 8, 2982);
    			attr_dev(p5, "class", "f5");
    			add_location(p5, file$7, 90, 6, 2919);
    			attr_dev(a8, "class", "f6 link dim ph3 pv2 dib white bg-black");
    			attr_dev(a8, "href", "https://github.com/cmudig/tempo-ql");
    			attr_dev(a8, "target", "_blank");
    			add_location(a8, file$7, 95, 8, 3077);
    			attr_dev(a9, "class", "f6 link dim ph3 pv2 dib white bg-black");
    			attr_dev(a9, "href", "https://arxiv.org/abs/2511.09337");
    			attr_dev(a9, "target", "_blank");
    			add_location(a9, file$7, 100, 8, 3243);
    			attr_dev(a10, "class", "f6 link dim ph3 pv2 dib white bg-black");
    			attr_dev(a10, "href", "http://tempoql-demo.uk.r.appspot.com/");
    			attr_dev(a10, "target", "_blank");
    			add_location(a10, file$7, 105, 8, 3409);
    			add_location(p6, file$7, 94, 6, 3065);
    			attr_dev(div1, "class", "project-preview flex flex-column pa2 mr2 bg-animate hover-bg-near-white svelte-109nu0e");
    			add_location(div1, file$7, 83, 4, 2677);
    			attr_dev(a11, "class", "link black mr2 svelte-109nu0e");
    			attr_dev(a11, "href", "http://tempoql-demo.uk.r.appspot.com/");
    			attr_dev(a11, "target", "_blank");
    			add_location(a11, file$7, 78, 2, 2570);
    			attr_dev(div2, "class", "project-preview-row flex justify-start svelte-109nu0e");
    			add_location(div2, file$7, 42, 0, 1411);
    			attr_dev(a12, "class", "link blue");
    			attr_dev(a12, "href", "/assets/venkats_cv.pdf");
    			add_location(a12, file$7, 116, 38, 3679);
    			attr_dev(p7, "class", "lh-copy f4 measure-wide");
    			add_location(p7, file$7, 115, 0, 3605);
    			attr_dev(p8, "class", "lh-copy f4 measure-wide");
    			add_location(p8, file$7, 121, 0, 3754);
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
    			insert_dev(target, t7, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, t8);
    			append_dev(p1, span0);
    			append_dev(p1, t10);
    			append_dev(p1, span1);
    			append_dev(p1, t12);
    			append_dev(p1, a2);
    			append_dev(p1, t14);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, p2, anchor);
    			append_dev(p2, t16);
    			append_dev(p2, a3);
    			append_dev(p2, t18);
    			insert_dev(target, t19, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, a7);
    			append_dev(a7, div0);
    			append_dev(div0, img0);
    			append_dev(div0, t20);
    			append_dev(div0, p3);
    			append_dev(p3, span2);
    			append_dev(p3, t22);
    			append_dev(p3, span3);
    			append_dev(div0, t24);
    			append_dev(div0, p4);
    			append_dev(p4, a4);
    			append_dev(p4, t26);
    			append_dev(p4, a5);
    			append_dev(p4, t28);
    			append_dev(p4, a6);
    			append_dev(div2, t30);
    			append_dev(div2, a11);
    			append_dev(a11, div1);
    			append_dev(div1, img1);
    			append_dev(div1, t31);
    			append_dev(div1, p5);
    			append_dev(p5, span4);
    			append_dev(p5, t33);
    			append_dev(p5, span5);
    			append_dev(div1, t35);
    			append_dev(div1, p6);
    			append_dev(p6, a8);
    			append_dev(p6, t37);
    			append_dev(p6, a9);
    			append_dev(p6, t39);
    			append_dev(p6, a10);
    			insert_dev(target, t41, anchor);
    			insert_dev(target, p7, anchor);
    			append_dev(p7, t42);
    			append_dev(p7, a12);
    			append_dev(p7, t44);
    			insert_dev(target, t45, anchor);
    			insert_dev(target, p8, anchor);

    			if (!mounted) {
    				dispose = listen_dev(a3, "click", /*click_handler*/ ctx[1], false, false, false);
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
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t19);
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t41);
    			if (detaching) detach_dev(p7);
    			if (detaching) detach_dev(t45);
    			if (detaching) detach_dev(p8);
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

    	const click_handler = () => dispatch("projects");
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
    	let h43;
    	let t26;
    	let span4;
    	let t28;
    	let p6;
    	let t30;
    	let p7;
    	let t32;
    	let h44;
    	let t33;
    	let span5;
    	let t35;
    	let p8;
    	let t37;
    	let p9;
    	let t39;
    	let h45;
    	let t40;
    	let span6;
    	let t42;
    	let p10;
    	let t44;
    	let p11;
    	let t46;
    	let h21;
    	let t48;
    	let h46;
    	let t49;
    	let span7;
    	let t51;
    	let p12;
    	let t53;
    	let h47;
    	let t54;
    	let span8;
    	let t56;
    	let p13;
    	let t58;
    	let h22;
    	let t60;
    	let h48;
    	let t61;
    	let span9;
    	let t63;
    	let p14;
    	let t65;
    	let p15;
    	let t67;
    	let h49;
    	let t68;
    	let span10;
    	let t70;
    	let p16;
    	let t72;
    	let p17;
    	let t74;
    	let h410;
    	let t75;
    	let span11;
    	let t77;
    	let p18;
    	let t79;
    	let p19;
    	let t81;
    	let h23;
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
    	let t95;
    	let p23;
    	let t97;
    	let h413;
    	let t98;
    	let span14;
    	let t100;
    	let p24;
    	let t102;
    	let p25;
    	let t104;
    	let h414;
    	let t105;
    	let span15;
    	let t107;
    	let p26;
    	let t109;
    	let p27;
    	let t111;
    	let h415;
    	let t112;
    	let span16;
    	let t114;
    	let p28;
    	let t116;
    	let p29;
    	let t118;
    	let h416;
    	let t119;
    	let span17;
    	let t121;
    	let p30;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text("Venkatesh Sivaraman ");
    			span0 = element("span");
    			span0.textContent = "Experience";
    			t2 = space();
    			div = element("div");
    			h20 = element("h2");
    			h20.textContent = "Employment";
    			t4 = space();
    			h40 = element("h4");
    			t5 = text("UC San Francisco ");
    			span1 = element("span");
    			span1.textContent = "January 2026 - present";
    			t7 = space();
    			p0 = element("p");
    			p0.textContent = "Postdoctoral Scholar";
    			t9 = space();
    			p1 = element("p");
    			p1.textContent = "Supervised by Profs. Jean Feng and Julian Hong and supported by the Weill\n    Cancer Hub West, building agentic AI tools to help clinical experts leverage\n    large-scale multimodal cancer data.";
    			t11 = space();
    			h41 = element("h4");
    			t12 = text("Wood Wide AI ");
    			span2 = element("span");
    			span2.textContent = "May 2025 - present";
    			t14 = space();
    			p2 = element("p");
    			p2.textContent = "Consultant";
    			t16 = space();
    			p3 = element("p");
    			p3.textContent = "As consultant during early founding stages, designed and implemented user\n    interfaces for human-in-the-loop machine learning.";
    			t18 = space();
    			h42 = element("h4");
    			t19 = text("Apple ");
    			span3 = element("span");
    			span3.textContent = "Summer 2023";
    			t21 = space();
    			p4 = element("p");
    			p4.textContent = "Machine Learning Research Intern";
    			t23 = space();
    			p5 = element("p");
    			p5.textContent = "Working with the Human-Centered Machine Intelligence team, developed\n    user-centered tools for machine learning model compression and evaluation.";
    			t25 = space();
    			h43 = element("h4");
    			t26 = text("Verily Life Sciences ");
    			span4 = element("span");
    			span4.textContent = "Summer 2022";
    			t28 = space();
    			p6 = element("p");
    			p6.textContent = "Health Informatics Intern";
    			t30 = space();
    			p7 = element("p");
    			p7.textContent = "Worked with the Verily Health Platforms Data Science team, developing\n    self-supervised deep learning approaches to characterize heart failure\n    disease states from clinical notes.";
    			t32 = space();
    			h44 = element("h4");
    			t33 = text("Verily Life Sciences ");
    			span5 = element("span");
    			span5.textContent = "Summer 2019";
    			t35 = space();
    			p8 = element("p");
    			p8.textContent = "Software Engineering Intern";
    			t37 = space();
    			p9 = element("p");
    			p9.textContent = "Worked on the Clinical Studies Platform Data Science team. Designed and\n    implemented an Apache Beam pipeline using both novel and existing NLP\n    algorithms to process the ClinicalTrials.gov database.";
    			t39 = space();
    			h45 = element("h4");
    			t40 = text("Apple ");
    			span6 = element("span");
    			span6.textContent = "Summer 2017";
    			t42 = space();
    			p10 = element("p");
    			p10.textContent = "Software Engineering Intern";
    			t44 = space();
    			p11 = element("p");
    			p11.textContent = "Developed software in Swift supporting the CarPlay, HomeKit, and MFi\n    certification programs. One of three projects selected to present to Apple\n    VP of Product Integrity.";
    			t46 = space();
    			h21 = element("h2");
    			h21.textContent = "Education";
    			t48 = space();
    			h46 = element("h4");
    			t49 = text("Carnegie Mellon University ");
    			span7 = element("span");
    			span7.textContent = "2020 - present";
    			t51 = space();
    			p12 = element("p");
    			p12.textContent = "Advised by Prof. Adam Perer";
    			t53 = space();
    			h47 = element("h4");
    			t54 = text("Massachusetts Institute of Technology ");
    			span8 = element("span");
    			span8.textContent = "2016 - 2020";
    			t56 = space();
    			p13 = element("p");
    			p13.textContent = "Computer Science and Molecular Biology, Minor in Music";
    			t58 = space();
    			h22 = element("h2");
    			h22.textContent = "Additional Research";
    			t60 = space();
    			h48 = element("h4");
    			t61 = text("Keating Lab, MIT Biology Department ");
    			span9 = element("span");
    			span9.textContent = "2018 - 2020";
    			t63 = space();
    			p14 = element("p");
    			p14.textContent = "Advised by Prof. Amy Keating";
    			t65 = space();
    			p15 = element("p");
    			p15.textContent = "Built a flexible high-throughput Python pipeline to compute and predict\n    protein binding affinities. Developed a C++ toolkit for designing novel\n    peptides, and an 3D visualization tool to render those peptides around a\n    known protein.";
    			t67 = space();
    			h49 = element("h4");
    			t68 = text("Structural Bioinformatics Lab, Pompeu Fabra University ");
    			span10 = element("span");
    			span10.textContent = "Summer 2018";
    			t70 = space();
    			p16 = element("p");
    			p16.textContent = "Advised by Prof. Baldo Oliva";
    			t72 = space();
    			p17 = element("p");
    			p17.textContent = "Created machine learning models to predict mutation-induced changes in\n    protein-protein and DNA-transcription factor interactions.";
    			t74 = space();
    			h410 = element("h4");
    			t75 = text("Kloczkowski Lab, Nationwide Children's Hospital ");
    			span11 = element("span");
    			span11.textContent = "2014 - 2016";
    			t77 = space();
    			p18 = element("p");
    			p18.textContent = "Advised by Prof. Andrzej Kloczkowski";
    			t79 = space();
    			p19 = element("p");
    			p19.textContent = "Developed a novel algorithm to predict protein structure based on statistics\n    of amino acid orientations.";
    			t81 = space();
    			h23 = element("h2");
    			h23.textContent = "Teaching";
    			t83 = space();
    			h411 = element("h4");
    			t84 = text("Machine Learning for Healthcare, CMU ");
    			span12 = element("span");
    			span12.textContent = "Fall 2024";
    			t86 = space();
    			p20 = element("p");
    			p20.textContent = "Taught by Adam Berger";
    			t88 = space();
    			p21 = element("p");
    			p21.textContent = "Taught a guest lecture on human-centered ML in healthcare, led office hours,\n    and mentored students' final projects.";
    			t90 = space();
    			h412 = element("h4");
    			t91 = text("Programming Usable Interfaces, CMU ");
    			span13 = element("span");
    			span13.textContent = "Fall 2022";
    			t93 = space();
    			p22 = element("p");
    			p22.textContent = "Taught by Prof. Alexandra Ion";
    			t95 = space();
    			p23 = element("p");
    			p23.textContent = "Led one of five lab sections, prepared lab, homework, and exam materials,\n    and graded assignments.";
    			t97 = space();
    			h413 = element("h4");
    			t98 = text("Interactive Data Science, CMU ");
    			span14 = element("span");
    			span14.textContent = "Spring 2022";
    			t100 = space();
    			p24 = element("p");
    			p24.textContent = "Taught by Prof. Adam Perer";
    			t102 = space();
    			p25 = element("p");
    			p25.textContent = "Led office hours, prepared lecture and lab materials, gave a lecture on\n    Uncertainty Visualization, and graded assignments.";
    			t104 = space();
    			h414 = element("h4");
    			t105 = text("Fundamentals of Music Processing, MIT ");
    			span15 = element("span");
    			span15.textContent = "Fall 2019";
    			t107 = space();
    			p26 = element("p");
    			p26.textContent = "Taught by Eric Humphrey";
    			t109 = space();
    			p27 = element("p");
    			p27.textContent = "As the only TA for the class, led office hours, helped prepare lecture, lab,\n    and homework materials, and taught a lecture on the music fingerprinting\n    algorithm (as used in Shazam).";
    			t111 = space();
    			h415 = element("h4");
    			t112 = text("Splash, MIT ");
    			span16 = element("span");
    			span16.textContent = "2018 and 2019";
    			t114 = space();
    			p28 = element("p");
    			p28.textContent = "Co-taught with Brian Mills";
    			t116 = space();
    			p29 = element("p");
    			p29.textContent = "Taught one-day classes to 20-40 high schoolers on topics such as film music\n    and music signal processing algorithms.";
    			t118 = space();
    			h416 = element("h4");
    			t119 = text("MehtA+ Machine Learning Bootcamp ");
    			span17 = element("span");
    			span17.textContent = "Summers 2020-2024";
    			t121 = space();
    			p30 = element("p");
    			p30.textContent = "Prepared and taught one guest lecture per summer on human-centered machine\n    learning, embedding representations, and uncertainty.";
    			attr_dev(span0, "class", "fw2");
    			add_location(span0, file$6, 1, 22, 39);
    			attr_dev(h1, "class", "mt2");
    			add_location(h1, file$6, 0, 0, 0);
    			add_location(h20, file$6, 5, 2, 115);
    			attr_dev(span1, "class", "fw2");
    			add_location(span1, file$6, 8, 21, 176);
    			attr_dev(h40, "class", "mb0");
    			add_location(h40, file$6, 7, 2, 138);
    			attr_dev(p0, "class", "lh-copy mv1");
    			add_location(p0, file$6, 10, 2, 234);
    			attr_dev(p1, "class", "lh-copy mv1 gray");
    			add_location(p1, file$6, 11, 2, 284);
    			attr_dev(span2, "class", "fw2");
    			add_location(span2, file$6, 18, 17, 556);
    			attr_dev(h41, "class", "mb0");
    			add_location(h41, file$6, 17, 2, 522);
    			attr_dev(p2, "class", "lh-copy mv1");
    			add_location(p2, file$6, 20, 2, 610);
    			attr_dev(p3, "class", "lh-copy mv1 gray");
    			add_location(p3, file$6, 21, 2, 650);
    			attr_dev(span3, "class", "fw2");
    			add_location(span3, file$6, 27, 10, 849);
    			attr_dev(h42, "class", "mb0");
    			add_location(h42, file$6, 26, 2, 822);
    			attr_dev(p4, "class", "lh-copy mv1");
    			add_location(p4, file$6, 29, 2, 896);
    			attr_dev(p5, "class", "lh-copy mv1 gray");
    			add_location(p5, file$6, 30, 2, 958);
    			attr_dev(span4, "class", "fw2");
    			add_location(span4, file$6, 36, 25, 1191);
    			attr_dev(h43, "class", "mb0");
    			add_location(h43, file$6, 35, 2, 1149);
    			attr_dev(p6, "class", "lh-copy mv1");
    			add_location(p6, file$6, 38, 2, 1238);
    			attr_dev(p7, "class", "lh-copy mv1 gray");
    			add_location(p7, file$6, 39, 2, 1293);
    			attr_dev(span5, "class", "fw2");
    			add_location(span5, file$6, 46, 25, 1563);
    			attr_dev(h44, "class", "mb0");
    			add_location(h44, file$6, 45, 2, 1521);
    			attr_dev(p8, "class", "lh-copy mv1");
    			add_location(p8, file$6, 48, 2, 1610);
    			attr_dev(p9, "class", "lh-copy mv1 gray");
    			add_location(p9, file$6, 49, 2, 1667);
    			attr_dev(span6, "class", "fw2");
    			add_location(span6, file$6, 56, 10, 1942);
    			attr_dev(h45, "class", "mb0");
    			add_location(h45, file$6, 55, 2, 1915);
    			attr_dev(p10, "class", "lh-copy mv1");
    			add_location(p10, file$6, 58, 2, 1989);
    			attr_dev(p11, "class", "lh-copy mv1 gray");
    			add_location(p11, file$6, 59, 2, 2046);
    			add_location(h21, file$6, 65, 2, 2266);
    			attr_dev(span7, "class", "fw2");
    			add_location(span7, file$6, 67, 31, 2335);
    			attr_dev(h46, "class", "mb0");
    			add_location(h46, file$6, 66, 2, 2287);
    			attr_dev(p12, "class", "lh-copy mv1");
    			add_location(p12, file$6, 69, 2, 2385);
    			attr_dev(span8, "class", "fw2");
    			add_location(span8, file$6, 72, 42, 2502);
    			attr_dev(h47, "class", "mb0");
    			add_location(h47, file$6, 71, 2, 2443);
    			attr_dev(p13, "class", "lh-copy mv1");
    			add_location(p13, file$6, 74, 2, 2549);
    			add_location(h22, file$6, 78, 2, 2642);
    			attr_dev(span9, "class", "fw2");
    			add_location(span9, file$6, 80, 40, 2730);
    			attr_dev(h48, "class", "mb0");
    			add_location(h48, file$6, 79, 2, 2673);
    			attr_dev(p14, "class", "lh-copy mv1");
    			add_location(p14, file$6, 82, 2, 2777);
    			attr_dev(p15, "class", "lh-copy mv1 gray");
    			add_location(p15, file$6, 83, 2, 2835);
    			attr_dev(span10, "class", "fw2");
    			add_location(span10, file$6, 91, 59, 3198);
    			attr_dev(h49, "class", "mb0");
    			add_location(h49, file$6, 90, 2, 3122);
    			attr_dev(p16, "class", "lh-copy mv1");
    			add_location(p16, file$6, 95, 2, 3257);
    			attr_dev(p17, "class", "lh-copy mv1 gray");
    			add_location(p17, file$6, 96, 2, 3315);
    			attr_dev(span11, "class", "fw2");
    			add_location(span11, file$6, 102, 52, 3561);
    			attr_dev(h410, "class", "mb0");
    			add_location(h410, file$6, 101, 2, 3492);
    			attr_dev(p18, "class", "lh-copy mv1");
    			add_location(p18, file$6, 106, 2, 3620);
    			attr_dev(p19, "class", "lh-copy mv1 gray");
    			add_location(p19, file$6, 107, 2, 3686);
    			add_location(h23, file$6, 112, 2, 3838);
    			attr_dev(span12, "class", "fw2");
    			add_location(span12, file$6, 115, 41, 3917);
    			attr_dev(h411, "class", "mb0");
    			add_location(h411, file$6, 114, 2, 3859);
    			attr_dev(p20, "class", "lh-copy mv1");
    			add_location(p20, file$6, 117, 2, 3962);
    			attr_dev(p21, "class", "lh-copy mv1 gray");
    			add_location(p21, file$6, 118, 2, 4013);
    			attr_dev(span13, "class", "fw2");
    			add_location(span13, file$6, 124, 39, 4232);
    			attr_dev(h412, "class", "mb0");
    			add_location(h412, file$6, 123, 2, 4176);
    			attr_dev(p22, "class", "lh-copy mv1");
    			add_location(p22, file$6, 126, 2, 4277);
    			attr_dev(p23, "class", "lh-copy mv1 gray");
    			add_location(p23, file$6, 127, 2, 4336);
    			attr_dev(span14, "class", "fw2");
    			add_location(span14, file$6, 133, 34, 4532);
    			attr_dev(h413, "class", "mb0");
    			add_location(h413, file$6, 132, 2, 4481);
    			attr_dev(p24, "class", "lh-copy mv1");
    			add_location(p24, file$6, 135, 2, 4579);
    			attr_dev(p25, "class", "lh-copy mv1 gray");
    			add_location(p25, file$6, 136, 2, 4635);
    			attr_dev(span15, "class", "fw2");
    			add_location(span15, file$6, 142, 42, 4864);
    			attr_dev(h414, "class", "mb0");
    			add_location(h414, file$6, 141, 2, 4805);
    			attr_dev(p26, "class", "lh-copy mv1");
    			add_location(p26, file$6, 144, 2, 4909);
    			attr_dev(p27, "class", "lh-copy mv1 gray");
    			add_location(p27, file$6, 145, 2, 4962);
    			attr_dev(span16, "class", "fw2");
    			add_location(span16, file$6, 152, 16, 5227);
    			attr_dev(h415, "class", "mb0");
    			add_location(h415, file$6, 151, 2, 5194);
    			attr_dev(p28, "class", "lh-copy mv1");
    			add_location(p28, file$6, 154, 2, 5276);
    			attr_dev(p29, "class", "lh-copy mv1 gray");
    			add_location(p29, file$6, 155, 2, 5332);
    			attr_dev(span17, "class", "fw2");
    			add_location(span17, file$6, 161, 37, 5549);
    			attr_dev(h416, "class", "mb0");
    			add_location(h416, file$6, 160, 2, 5495);
    			attr_dev(p30, "class", "lh-copy mv1 gray");
    			add_location(p30, file$6, 163, 2, 5602);
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
    			append_dev(div, h43);
    			append_dev(h43, t26);
    			append_dev(h43, span4);
    			append_dev(div, t28);
    			append_dev(div, p6);
    			append_dev(div, t30);
    			append_dev(div, p7);
    			append_dev(div, t32);
    			append_dev(div, h44);
    			append_dev(h44, t33);
    			append_dev(h44, span5);
    			append_dev(div, t35);
    			append_dev(div, p8);
    			append_dev(div, t37);
    			append_dev(div, p9);
    			append_dev(div, t39);
    			append_dev(div, h45);
    			append_dev(h45, t40);
    			append_dev(h45, span6);
    			append_dev(div, t42);
    			append_dev(div, p10);
    			append_dev(div, t44);
    			append_dev(div, p11);
    			append_dev(div, t46);
    			append_dev(div, h21);
    			append_dev(div, t48);
    			append_dev(div, h46);
    			append_dev(h46, t49);
    			append_dev(h46, span7);
    			append_dev(div, t51);
    			append_dev(div, p12);
    			append_dev(div, t53);
    			append_dev(div, h47);
    			append_dev(h47, t54);
    			append_dev(h47, span8);
    			append_dev(div, t56);
    			append_dev(div, p13);
    			append_dev(div, t58);
    			append_dev(div, h22);
    			append_dev(div, t60);
    			append_dev(div, h48);
    			append_dev(h48, t61);
    			append_dev(h48, span9);
    			append_dev(div, t63);
    			append_dev(div, p14);
    			append_dev(div, t65);
    			append_dev(div, p15);
    			append_dev(div, t67);
    			append_dev(div, h49);
    			append_dev(h49, t68);
    			append_dev(h49, span10);
    			append_dev(div, t70);
    			append_dev(div, p16);
    			append_dev(div, t72);
    			append_dev(div, p17);
    			append_dev(div, t74);
    			append_dev(div, h410);
    			append_dev(h410, t75);
    			append_dev(h410, span11);
    			append_dev(div, t77);
    			append_dev(div, p18);
    			append_dev(div, t79);
    			append_dev(div, p19);
    			append_dev(div, t81);
    			append_dev(div, h23);
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
    			append_dev(div, t95);
    			append_dev(div, p23);
    			append_dev(div, t97);
    			append_dev(div, h413);
    			append_dev(h413, t98);
    			append_dev(h413, span14);
    			append_dev(div, t100);
    			append_dev(div, p24);
    			append_dev(div, t102);
    			append_dev(div, p25);
    			append_dev(div, t104);
    			append_dev(div, h414);
    			append_dev(h414, t105);
    			append_dev(h414, span15);
    			append_dev(div, t107);
    			append_dev(div, p26);
    			append_dev(div, t109);
    			append_dev(div, p27);
    			append_dev(div, t111);
    			append_dev(div, h415);
    			append_dev(h415, t112);
    			append_dev(h415, span16);
    			append_dev(div, t114);
    			append_dev(div, p28);
    			append_dev(div, t116);
    			append_dev(div, p29);
    			append_dev(div, t118);
    			append_dev(div, h416);
    			append_dev(h416, t119);
    			append_dev(h416, span17);
    			append_dev(div, t121);
    			append_dev(div, p30);
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

    // (37:2) {:else}
    function create_else_block$1(ctx) {
    	let div1;
    	let t;
    	let div0;
    	let current;

    	function select_block_type_2(ctx, dirty) {
    		if (!!/*imageSrc*/ ctx[0]) return create_if_block_3$1;
    		if (!!/*videoSrc*/ ctx[3]) return create_if_block_4$1;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type && current_block_type(ctx);
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "pa2 card-content svelte-1i47ena");
    			add_location(div0, file$5, 58, 6, 1763);
    			attr_dev(div1, "class", "card pa3 svelte-1i47ena");
    			add_location(div1, file$5, 37, 4, 1087);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
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
    			if (detaching) detach_dev(div1);

    			if (if_block) {
    				if_block.d();
    			}

    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(37:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (9:2) {#if !!url}
    function create_if_block$2(ctx) {
    	let a;
    	let div1;
    	let t;
    	let div0;
    	let current;

    	function select_block_type_1(ctx, dirty) {
    		if (!!/*imageSrc*/ ctx[0]) return create_if_block_1$2;
    		if (!!/*videoSrc*/ ctx[3]) return create_if_block_2$1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type && current_block_type(ctx);
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			a = element("a");
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "pa2 card-content svelte-1i47ena");
    			add_location(div0, file$5, 31, 8, 986);
    			attr_dev(div1, "class", "card pa3 bg-animate hover-bg-near-white pointer svelte-1i47ena");
    			add_location(div1, file$5, 10, 6, 229);
    			attr_dev(a, "href", /*url*/ ctx[2]);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "link black");
    			add_location(a, file$5, 9, 4, 173);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, div1);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
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
    			if (detaching) detach_dev(a);

    			if (if_block) {
    				if_block.d();
    			}

    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(9:2) {#if !!url}",
    		ctx
    	});

    	return block;
    }

    // (47:27) 
    function create_if_block_4$1(ctx) {
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
    			add_location(iframe, file$5, 48, 10, 1392);
    			attr_dev(div, "class", "video-container svelte-1i47ena");
    			add_location(div, file$5, 47, 8, 1352);
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
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(47:27) ",
    		ctx
    	});

    	return block;
    }

    // (39:6) {#if !!imageSrc}
    function create_if_block_3$1(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*imageSrc*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "db w-100 card-img br2 br--top svelte-1i47ena");
    			attr_dev(img, "alt", /*imageAlt*/ ctx[1]);
    			add_location(img, file$5, 40, 10, 1179);
    			attr_dev(div, "class", "img-container svelte-1i47ena");
    			add_location(div, file$5, 39, 8, 1141);
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
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(39:6) {#if !!imageSrc}",
    		ctx
    	});

    	return block;
    }

    // (20:29) 
    function create_if_block_2$1(ctx) {
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
    			add_location(iframe, file$5, 21, 12, 595);
    			attr_dev(div, "class", "video-container svelte-1i47ena");
    			add_location(div, file$5, 20, 10, 553);
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
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(20:29) ",
    		ctx
    	});

    	return block;
    }

    // (12:8) {#if !!imageSrc}
    function create_if_block_1$2(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*imageSrc*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "db w-100 card-img br2 br--top svelte-1i47ena");
    			attr_dev(img, "alt", /*imageAlt*/ ctx[1]);
    			add_location(img, file$5, 13, 12, 366);
    			attr_dev(div, "class", "img-container svelte-1i47ena");
    			add_location(div, file$5, 12, 10, 326);
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
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(12:8) {#if !!imageSrc}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!!/*url*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "w-100 pa1");
    			add_location(div, file$5, 7, 0, 131);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
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
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
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

    // (13:2) <Card     imageSrc="assets/libretto.png"     imageAlt="Screenshot of Libretto being used to evaluate extractions of tumor stage and grade from oncology notes."   >
    function create_default_slot_7$1(ctx) {
    	let h3;
    	let t0;
    	let span;
    	let t2;
    	let p0;
    	let t3;
    	let em;
    	let t5;
    	let t6;
    	let p1;
    	let a0;
    	let t8;
    	let a1;
    	let t10;
    	let a2;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text("Libretto: ");
    			span = element("span");
    			span.textContent = "Interactive LLM Chart Abstraction";
    			t2 = space();
    			p0 = element("p");
    			t3 = text("An interactive system for clinician researchers to specify and evaluate ");
    			em = element("em");
    			em.textContent = "abstraction tasks";
    			t5 = text(" on patient records, helping them produce structured data for analysis.");
    			t6 = space();
    			p1 = element("p");
    			a0 = element("a");
    			a0.textContent = "GitHub";
    			t8 = space();
    			a1 = element("a");
    			a1.textContent = "Preprint";
    			t10 = space();
    			a2 = element("a");
    			a2.textContent = "Demo";
    			attr_dev(span, "class", "fw3 ml1");
    			add_location(span, file$4, 17, 16, 571);
    			attr_dev(h3, "class", "mb0 lh-title");
    			add_location(h3, file$4, 16, 4, 529);
    			add_location(em, file$4, 20, 78, 746);
    			attr_dev(p0, "class", "lh-copy");
    			add_location(p0, file$4, 19, 4, 648);
    			attr_dev(a0, "class", "f6 link dim ph3 pv2 dib white bg-black");
    			attr_dev(a0, "href", "https://github.com/weill-cancer-hub-west-impact-ai/libretto");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$4, 25, 6, 883);
    			attr_dev(a1, "class", "f6 link dim ph3 pv2 dib white bg-black");
    			attr_dev(a1, "href", "https://arxiv.org/abs/2609.19318");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$4, 30, 6, 1064);
    			attr_dev(a2, "class", "f6 link dim ph3 pv2 dib white bg-black");
    			attr_dev(a2, "href", "https://libretto-demo.uw.r.appspot.com/");
    			attr_dev(a2, "target", "_blank");
    			add_location(a2, file$4, 35, 6, 1220);
    			add_location(p1, file$4, 24, 4, 873);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			append_dev(h3, span);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p0, anchor);
    			append_dev(p0, t3);
    			append_dev(p0, em);
    			append_dev(p0, t5);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, a0);
    			append_dev(p1, t8);
    			append_dev(p1, a1);
    			append_dev(p1, t10);
    			append_dev(p1, a2);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(p1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$1.name,
    		type: "slot",
    		source: "(13:2) <Card     imageSrc=\\\"assets/libretto.png\\\"     imageAlt=\\\"Screenshot of Libretto being used to evaluate extractions of tumor stage and grade from oncology notes.\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (43:2) <Card     imageSrc="assets/tempo.png"     imageAlt="Screenshot of Tempo being used to create models to predict patient readmission to a hospital."   >
    function create_default_slot_6$1(ctx) {
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
    			t0 = text("Tempo/TempoQL: ");
    			span = element("span");
    			span.textContent = "Predictive Model Specification";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "A tool that allows data scientists and domain experts to collaboratively\n      create, modify, and evaluate specifications of how a predictive model\n      should work. We also expanded Tempo's query language into a universal\n      query language for time-series EHR data, called TempoQL.";
    			t4 = space();
    			p1 = element("p");
    			a0 = element("a");
    			a0.textContent = "GitHub";
    			t6 = space();
    			a1 = element("a");
    			a1.textContent = "Preprint";
    			t8 = space();
    			a2 = element("a");
    			a2.textContent = "TempoQL Demo";
    			attr_dev(span, "class", "fw3 ml1");
    			add_location(span, file$4, 47, 21, 1596);
    			attr_dev(h3, "class", "mb0 lh-title");
    			add_location(h3, file$4, 46, 4, 1549);
    			attr_dev(p0, "class", "lh-copy");
    			add_location(p0, file$4, 49, 4, 1670);
    			attr_dev(a0, "class", "f6 link dim ph3 pv2 dib white bg-black");
    			attr_dev(a0, "href", "https://github.com/cmudig/tempo");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$4, 56, 6, 2007);
    			attr_dev(a1, "class", "f6 link dim ph3 pv2 dib white bg-black");
    			attr_dev(a1, "href", "https://arxiv.org/abs/2502.10526");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$4, 61, 6, 2160);
    			attr_dev(a2, "class", "f6 link dim ph3 pv2 dib white bg-black");
    			attr_dev(a2, "href", "http://tempoql-demo.uk.r.appspot.com/");
    			attr_dev(a2, "target", "_blank");
    			add_location(a2, file$4, 66, 6, 2316);
    			add_location(p1, file$4, 55, 4, 1997);
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
    		id: create_default_slot_6$1.name,
    		type: "slot",
    		source: "(43:2) <Card     imageSrc=\\\"assets/tempo.png\\\"     imageAlt=\\\"Screenshot of Tempo being used to create models to predict patient readmission to a hospital.\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (74:2) <Card     imageSrc="assets/counterpoint_animation.gif"     imageAlt="A GIF of Counterpoint used to animate between two scatter plot layouts containing 10,000 points."     url="https://dig.cmu.edu/counterpoint/"   >
    function create_default_slot_5$1(ctx) {
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
    			t0 = text("Counterpoint: ");
    			span = element("span");
    			span.textContent = "Scalable Custom Web Visualization";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "Counterpoint is a TypeScript framework that helps developers create\n      interactive, animated data visualizations using custom Canvas or WebGL\n      rendering.";
    			t4 = space();
    			p1 = element("p");
    			a0 = element("a");
    			a0.textContent = "Documentation";
    			t6 = space();
    			a1 = element("a");
    			a1.textContent = "GitHub";
    			t8 = space();
    			a2 = element("a");
    			a2.textContent = "NPM";
    			attr_dev(span, "class", "fw3 ml1");
    			add_location(span, file$4, 79, 20, 2761);
    			attr_dev(h3, "class", "mb0 lh-title");
    			add_location(h3, file$4, 78, 4, 2715);
    			attr_dev(p0, "class", "lh-copy");
    			add_location(p0, file$4, 83, 4, 2854);
    			attr_dev(a0, "class", "f6 link dim ph3 pv2 dib white bg-blue");
    			attr_dev(a0, "href", "https://dig.cmu.edu/counterpoint/");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$4, 89, 6, 3065);
    			attr_dev(a1, "class", "f6 link dim ph3 pv2 dib white bg-black");
    			attr_dev(a1, "href", "https://github.com/cmudig/counterpoint");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$4, 94, 6, 3226);
    			attr_dev(a2, "class", "f6 link dim ph3 pv2 dib white bg-black");
    			attr_dev(a2, "href", "https://www.npmjs.com/package/counterpoint-vis");
    			attr_dev(a2, "target", "_blank");
    			add_location(a2, file$4, 99, 6, 3386);
    			add_location(p1, file$4, 88, 4, 3055);
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
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(74:2) <Card     imageSrc=\\\"assets/counterpoint_animation.gif\\\"     imageAlt=\\\"A GIF of Counterpoint used to animate between two scatter plot layouts containing 10,000 points.\\\"     url=\\\"https://dig.cmu.edu/counterpoint/\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (107:2) <Card     imageSrc="assets/divisi.png"     imageAlt="Screenshot of Divisi showing slices for a model trained on the UCI Adult dataset."     url="https://github.com/cmudig/divisi-toolkit"   >
    function create_default_slot_4$1(ctx) {
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
    			t0 = text("Divisi: ");
    			span = element("span");
    			span.textContent = "Interactive Slice Discovery";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "A work-in-progress Jupyter widget that uses a novel sampling-based\n      algorithm to find data slices (or subgroups) that have interesting\n      characteristics relative to the overall dataset.";
    			t4 = space();
    			p1 = element("p");
    			a0 = element("a");
    			a0.textContent = "GitHub";
    			t6 = space();
    			a1 = element("a");
    			a1.textContent = "Preprint";
    			attr_dev(span, "class", "fw3 ml1");
    			add_location(span, file$4, 112, 14, 3801);
    			attr_dev(h3, "class", "mb0 lh-title");
    			add_location(h3, file$4, 111, 4, 3761);
    			attr_dev(p0, "class", "lh-copy");
    			add_location(p0, file$4, 114, 4, 3872);
    			attr_dev(a0, "class", "f6 link dim ph3 pv2 dib white bg-black");
    			attr_dev(a0, "href", "https://github.com/cmudig/divisi-toolkit");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$4, 120, 6, 4116);
    			attr_dev(a1, "class", "f6 link dim ph3 pv2 dib white bg-black");
    			attr_dev(a1, "href", "https://arxiv.org/abs/2502.10537");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$4, 125, 6, 4278);
    			add_location(p1, file$4, 119, 4, 4106);
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
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(107:2) <Card     imageSrc=\\\"assets/divisi.png\\\"     imageAlt=\\\"Screenshot of Divisi showing slices for a model trained on the UCI Adult dataset.\\\"     url=\\\"https://github.com/cmudig/divisi-toolkit\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (133:2) <Card     imageSrc="assets/emblaze.png"     imageAlt="Two screenshots of the Emblaze user interface."     url="https://github.com/cmudig/emblaze"   >
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
    			a0.textContent = "Video";
    			t6 = space();
    			a1 = element("a");
    			a1.textContent = "GitHub";
    			attr_dev(span, "class", "fw3 ml1");
    			add_location(span, file$4, 138, 15, 4644);
    			attr_dev(h3, "class", "mb0 lh-title");
    			add_location(h3, file$4, 137, 4, 4603);
    			attr_dev(p0, "class", "lh-copy");
    			add_location(p0, file$4, 142, 4, 4743);
    			attr_dev(a0, "class", "f6 link dim ph3 pv2 dib white bg-blue");
    			attr_dev(a0, "href", "https://drive.google.com/file/d/1h7N73O4Q-d_9l9H5TT0V8VLqtlpWKsM7/view?usp=share_link");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$4, 147, 6, 4930);
    			attr_dev(a1, "class", "f6 link dim ph3 pv2 dib white bg-black");
    			attr_dev(a1, "href", "https://github.com/cmudig/emblaze");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$4, 152, 6, 5135);
    			add_location(p1, file$4, 146, 4, 4920);
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
    		source: "(133:2) <Card     imageSrc=\\\"assets/emblaze.png\\\"     imageAlt=\\\"Two screenshots of the Emblaze user interface.\\\"     url=\\\"https://github.com/cmudig/emblaze\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (160:2) <Card     imageSrc="assets/textessence.png"     imageAlt="Screenshot of TextEssence that shows a scatter plot of COVID concepts"     url="https://textessence.dbmi.pitt.edu"   >
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
    			add_location(span, file$4, 165, 19, 5531);
    			attr_dev(h3, "class", "mb0 lh-title");
    			add_location(h3, file$4, 164, 4, 5486);
    			attr_dev(p0, "class", "lh-copy");
    			add_location(p0, file$4, 169, 4, 5628);
    			attr_dev(a0, "class", "f6 link dim ph3 pv2 dib white bg-blue");
    			attr_dev(a0, "href", "https://textessence.dbmi.pitt.edu");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$4, 175, 6, 5895);
    			attr_dev(a1, "class", "f6 link dim ph3 pv2 dib white bg-black");
    			attr_dev(a1, "href", "https://github.com/drgriffis/text-essence");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$4, 180, 6, 6047);
    			attr_dev(a2, "class", "f6 link dim ph3 pv2 dib white bg-black");
    			attr_dev(a2, "href", "https://aclanthology.org/2021.naacl-demos.13/");
    			attr_dev(a2, "target", "_blank");
    			add_location(a2, file$4, 185, 6, 6210);
    			add_location(p1, file$4, 174, 4, 5885);
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
    		source: "(160:2) <Card     imageSrc=\\\"assets/textessence.png\\\"     imageAlt=\\\"Screenshot of TextEssence that shows a scatter plot of COVID concepts\\\"     url=\\\"https://textessence.dbmi.pitt.edu\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (193:2) <Card     imageSrc="assets/fireroad.png"     imageAlt="Two smartphones showing screenshots of FireRoad"     url="https://fireroad.mit.edu"   >
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
    			add_location(span, file$4, 198, 16, 6580);
    			attr_dev(h3, "class", "mb0 lh-title");
    			add_location(h3, file$4, 197, 4, 6538);
    			attr_dev(p0, "class", "lh-copy");
    			add_location(p0, file$4, 200, 4, 6642);
    			attr_dev(a0, "class", "f6 link dim ph3 pv2 dib white bg-blue");
    			attr_dev(a0, "href", "https://fireroad.mit.edu");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$4, 206, 6, 6923);
    			attr_dev(a1, "class", "f6 link dim ph3 pv2 dib white bg-black");
    			attr_dev(a1, "href", "https://github.com/venkatesh-sivaraman/fireroad-server");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$4, 211, 6, 7069);
    			add_location(p1, file$4, 205, 4, 6913);
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
    		source: "(193:2) <Card     imageSrc=\\\"assets/fireroad.png\\\"     imageAlt=\\\"Two smartphones showing screenshots of FireRoad\\\"     url=\\\"https://fireroad.mit.edu\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (219:2) <Card     imageSrc="assets/shapesynth.png"     imageAlt="Two screenshots of ShapeSynth showing colored shapes in each corner"     url="https://github.com/mdhuggins/shapesynth"   >
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
    			add_location(span, file$4, 224, 18, 7488);
    			attr_dev(h3, "class", "mb0 lh-title");
    			add_location(h3, file$4, 223, 4, 7444);
    			attr_dev(p0, "class", "lh-copy");
    			add_location(p0, file$4, 226, 4, 7559);
    			attr_dev(a, "class", "f6 link dim ph3 pv2 dib white bg-black");
    			attr_dev(a, "href", "https://github.com/mdhuggins/shapesynth");
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$4, 233, 6, 7849);
    			add_location(p1, file$4, 232, 4, 7839);
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
    		source: "(219:2) <Card     imageSrc=\\\"assets/shapesynth.png\\\"     imageAlt=\\\"Two screenshots of ShapeSynth showing colored shapes in each corner\\\"     url=\\\"https://github.com/mdhuggins/shapesynth\\\"   >",
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
    	let t9;
    	let card5;
    	let t10;
    	let card6;
    	let t11;
    	let card7;
    	let current;

    	card0 = new Card({
    			props: {
    				imageSrc: "assets/libretto.png",
    				imageAlt: "Screenshot of Libretto being used to evaluate extractions of tumor stage and grade from oncology notes.",
    				$$slots: { default: [create_default_slot_7$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card1 = new Card({
    			props: {
    				imageSrc: "assets/tempo.png",
    				imageAlt: "Screenshot of Tempo being used to create models to predict patient readmission to a hospital.",
    				$$slots: { default: [create_default_slot_6$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card2 = new Card({
    			props: {
    				imageSrc: "assets/counterpoint_animation.gif",
    				imageAlt: "A GIF of Counterpoint used to animate between two scatter plot layouts containing 10,000 points.",
    				url: "https://dig.cmu.edu/counterpoint/",
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card3 = new Card({
    			props: {
    				imageSrc: "assets/divisi.png",
    				imageAlt: "Screenshot of Divisi showing slices for a model trained on the UCI Adult dataset.",
    				url: "https://github.com/cmudig/divisi-toolkit",
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card4 = new Card({
    			props: {
    				imageSrc: "assets/emblaze.png",
    				imageAlt: "Two screenshots of the Emblaze user interface.",
    				url: "https://github.com/cmudig/emblaze",
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card5 = new Card({
    			props: {
    				imageSrc: "assets/textessence.png",
    				imageAlt: "Screenshot of TextEssence that shows a scatter plot of COVID concepts",
    				url: "https://textessence.dbmi.pitt.edu",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card6 = new Card({
    			props: {
    				imageSrc: "assets/fireroad.png",
    				imageAlt: "Two smartphones showing screenshots of FireRoad",
    				url: "https://fireroad.mit.edu",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card7 = new Card({
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
    			t9 = space();
    			create_component(card5.$$.fragment);
    			t10 = space();
    			create_component(card6.$$.fragment);
    			t11 = space();
    			create_component(card7.$$.fragment);
    			attr_dev(span, "class", "fw2");
    			add_location(span, file$4, 5, 22, 95);
    			attr_dev(h1, "class", "mt2");
    			add_location(h1, file$4, 4, 0, 56);
    			attr_dev(p, "class", "lh-copy measure f5");
    			add_location(p, file$4, 7, 0, 135);
    			attr_dev(div, "class", "card-container svelte-153zum2");
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
    			append_dev(div, t9);
    			mount_component(card5, div, null);
    			append_dev(div, t10);
    			mount_component(card6, div, null);
    			append_dev(div, t11);
    			mount_component(card7, div, null);
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
    	let a0;
    	let t10;
    	let p1;
    	let t11;
    	let strong1;
    	let t13;
    	let em1;
    	let t15;
    	let a1;
    	let t17;
    	let p2;
    	let strong2;
    	let t19;
    	let em2;
    	let t21;
    	let a2;
    	let t23;
    	let a3;
    	let t25;
    	let h21;
    	let t27;
    	let p3;
    	let t28;
    	let strong3;
    	let t30;
    	let em3;
    	let t32;
    	let a4;
    	let t34;
    	let a5;
    	let t36;
    	let a6;
    	let t38;
    	let p4;
    	let strong4;
    	let t40;
    	let em4;
    	let t42;
    	let a7;
    	let t44;
    	let a8;
    	let t46;
    	let p5;
    	let strong5;
    	let t48;
    	let em5;
    	let t50;
    	let a9;
    	let t52;
    	let a10;
    	let t54;
    	let p6;
    	let strong6;
    	let t56;
    	let em6;
    	let t58;
    	let a11;
    	let t60;
    	let h22;
    	let t62;
    	let p7;
    	let t63;
    	let strong7;
    	let t65;
    	let em7;
    	let t67;
    	let a12;
    	let t69;
    	let a13;
    	let t71;
    	let a14;
    	let t73;
    	let p8;
    	let strong8;
    	let t75;
    	let em8;
    	let t77;
    	let a15;
    	let t79;
    	let a16;
    	let t81;
    	let p9;
    	let t82;
    	let strong9;
    	let t84;
    	let em9;
    	let t86;
    	let a17;
    	let t88;
    	let h23;
    	let t90;
    	let p10;
    	let strong10;
    	let t92;
    	let em10;
    	let t94;
    	let a18;
    	let t96;
    	let h24;
    	let t98;
    	let p11;
    	let t99;
    	let strong11;
    	let t101;
    	let em11;
    	let t103;
    	let em12;
    	let t105;
    	let a19;
    	let t107;
    	let p12;
    	let t108;
    	let strong12;
    	let t110;
    	let em13;
    	let t112;
    	let a20;
    	let t114;
    	let p13;
    	let t115;
    	let strong13;
    	let t117;
    	let em14;
    	let t119;
    	let a21;
    	let t121;
    	let a22;
    	let t123;
    	let p14;
    	let strong14;
    	let t125;
    	let em15;
    	let t127;
    	let a23;
    	let t129;
    	let a24;
    	let t131;
    	let a25;
    	let t133;
    	let p15;
    	let t134;
    	let strong15;
    	let t136;
    	let em16;
    	let t138;
    	let h25;
    	let t140;
    	let p16;
    	let t141;
    	let strong16;
    	let t143;
    	let em17;
    	let t145;
    	let a26;
    	let t147;
    	let a27;
    	let t149;
    	let p17;
    	let t150;
    	let strong17;
    	let t152;
    	let em18;
    	let t154;
    	let a28;
    	let t156;
    	let a29;
    	let t158;
    	let a30;
    	let t160;
    	let p18;
    	let t161;
    	let strong18;
    	let t163;
    	let em19;
    	let t165;
    	let a31;
    	let t167;
    	let h26;
    	let t169;
    	let p19;
    	let strong19;
    	let t171;
    	let em20;
    	let t173;
    	let a32;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text("Venkatesh Sivaraman ");
    			span = element("span");
    			span.textContent = "Publications";
    			t2 = space();
    			section = element("section");
    			h20 = element("h2");
    			h20.textContent = "2026";
    			t4 = space();
    			p0 = element("p");
    			strong0 = element("strong");
    			strong0.textContent = "Sivaraman, V.";
    			t6 = text(", et al. \"I know where to look,\" but does the\n    LLM? Charting the gaps between clinical expert needs and unstructured data\n    abstraction tools.\n    ");
    			em0 = element("em");
    			em0.textContent = "Under review.";
    			t8 = space();
    			a0 = element("a");
    			a0.textContent = "[Preprint]";
    			t10 = space();
    			p1 = element("p");
    			t11 = text("Zhou, S., Vossler, P., ");
    			strong1 = element("strong");
    			strong1.textContent = "Sivaraman, V.";
    			t13 = text(", Mai, Y., Feng, J.\n    Adaptive auditing of AI systems with anytime-valid guarantees.\n    ");
    			em1 = element("em");
    			em1.textContent = "To appear at NeurIPS 2026.";
    			t15 = space();
    			a1 = element("a");
    			a1.textContent = "[Preprint]";
    			t17 = space();
    			p2 = element("p");
    			strong2 = element("strong");
    			strong2.textContent = "Sivaraman, V.";
    			t19 = text(", Mason, E., Li, M., Tong, J., King, A.J.,\n    Kahn, J.M., Perer, A. Intelligent Reasoning Cues: A framework and case study\n    of the roles of AI information in complex decisions.\n    ");
    			em2 = element("em");
    			em2.textContent = "ACM CHI 2026.";
    			t21 = space();
    			a2 = element("a");
    			a2.textContent = "[Preprint]";
    			t23 = space();
    			a3 = element("a");
    			a3.textContent = "[GitHub]";
    			t25 = space();
    			h21 = element("h2");
    			h21.textContent = "2025";
    			t27 = space();
    			p3 = element("p");
    			t28 = text("Ma, Z., Boyce, R.D., Perer, A., ");
    			strong3 = element("strong");
    			strong3.textContent = "Sivaraman, V.";
    			t30 = text(" TempoQL: A\n    readable, precise, and portable query system for electronic health record\n    data.\n    ");
    			em3 = element("em");
    			em3.textContent = "Machine Learning for Health (ML4H) 2025.";
    			t32 = space();
    			a4 = element("a");
    			a4.textContent = "[Paper]";
    			t34 = space();
    			a5 = element("a");
    			a5.textContent = "[GitHub]";
    			t36 = space();
    			a6 = element("a");
    			a6.textContent = "[Demo]";
    			t38 = space();
    			p4 = element("p");
    			strong4 = element("strong");
    			strong4.textContent = "Sivaraman, V.";
    			t40 = text(", Vaishampayan, A., Li, X., Buck, B.R., Ma,\n    Z., Boyce, R.D., Perer, A. Tempo: Helping data scientists and domain experts\n    collaboratively specify predictive modeling tasks.\n    ");
    			em4 = element("em");
    			em4.textContent = "ACM CHI 2025.";
    			t42 = space();
    			a7 = element("a");
    			a7.textContent = "[Preprint]";
    			t44 = space();
    			a8 = element("a");
    			a8.textContent = "[GitHub]";
    			t46 = space();
    			p5 = element("p");
    			strong5 = element("strong");
    			strong5.textContent = "Sivaraman, V.";
    			t48 = text(", Li, Z., Perer, A. Divisi: Interactive Search\n    and Visualization for Scalable Exploratory Subgroup Analysis.\n    ");
    			em5 = element("em");
    			em5.textContent = "ACM CHI 2025.";
    			t50 = space();
    			a9 = element("a");
    			a9.textContent = "[Preprint]";
    			t52 = space();
    			a10 = element("a");
    			a10.textContent = "[GitHub]";
    			t54 = space();
    			p6 = element("p");
    			strong6 = element("strong");
    			strong6.textContent = "Sivaraman, V.";
    			t56 = text(", Kwak, Y., Kuza, C., Yang, Q., Adamson, K.,\n    Suda, K., Tang, L., Gellad, W., Perer, A. Static algorithm, evolving\n    epidemic: Understanding the potential of human-AI risk assessment to support\n    regional overdose prevention. ");
    			em6 = element("em");
    			em6.textContent = "ACM CSCW 2025.";
    			t58 = space();
    			a11 = element("a");
    			a11.textContent = "[Preprint]";
    			t60 = space();
    			h22 = element("h2");
    			h22.textContent = "2024";
    			t62 = space();
    			p7 = element("p");
    			t63 = text("Boggust, A., ");
    			strong7 = element("strong");
    			strong7.textContent = "Sivaraman, V.";
    			t65 = text(" (co-first authors), Assogba, Y.,\n    Ren, D., Moritz, D., Hohman, F. Compress and Compare: Interactively\n    evaluating efficiency and behavior across ML model compression experiments.\n    ");
    			em7 = element("em");
    			em7.textContent = "IEEE VIS 2024.";
    			t67 = space();
    			a12 = element("a");
    			a12.textContent = "[Article]";
    			t69 = space();
    			a13 = element("a");
    			a13.textContent = "[Preprint]";
    			t71 = space();
    			a14 = element("a");
    			a14.textContent = "[GitHub]";
    			t73 = space();
    			p8 = element("p");
    			strong8 = element("strong");
    			strong8.textContent = "Sivaraman, V.";
    			t75 = text(", Elavsky, F., Moritz, D., Perer, A.\n    Counterpoint: Orchestrating large-scale custom animated visualizations.\n    ");
    			em8 = element("em");
    			em8.textContent = "IEEE VIS 2024.";
    			t77 = space();
    			a15 = element("a");
    			a15.textContent = "[Documentation]";
    			t79 = space();
    			a16 = element("a");
    			a16.textContent = "[GitHub]";
    			t81 = space();
    			p9 = element("p");
    			t82 = text("Park, U., ");
    			strong9 = element("strong");
    			strong9.textContent = "Sivaraman, V.";
    			t84 = text(", Perer, A. How Consistent are\n    Clinicians? Evaluating the Predictability of Sepsis Disease Progression with\n    Dynamics Models.\n    ");
    			em9 = element("em");
    			em9.textContent = "Workshop paper at Time Series for Health @ ICLR 2024.";
    			t86 = space();
    			a17 = element("a");
    			a17.textContent = "[Article]";
    			t88 = space();
    			h23 = element("h2");
    			h23.textContent = "2023";
    			t90 = space();
    			p10 = element("p");
    			strong10 = element("strong");
    			strong10.textContent = "Sivaraman, V.";
    			t92 = text(", Bukowski, L., Levin, J., Kahn, J.M., Perer,\n    A. Ignore, trust, or negotiate: Understanding clinician acceptance of\n    AI-based treatment recommendations in health care.\n    ");
    			em10 = element("em");
    			em10.textContent = "ACM CHI 2023.";
    			t94 = space();
    			a18 = element("a");
    			a18.textContent = "[Article]";
    			t96 = space();
    			h24 = element("h2");
    			h24.textContent = "2022";
    			t98 = space();
    			p11 = element("p");
    			t99 = text("Kawakami, A., ");
    			strong11 = element("strong");
    			strong11.textContent = "Sivaraman, V.";
    			t101 = space();
    			em11 = element("em");
    			em11.textContent = "(co-first authors)";
    			t103 = text(",\n    Stapleton, L., Cheng, H., Perer, A., Wu, S., Zhu, H., Holstein, K. (2022).\n    \"Why Do I Care What's Similar?\" Probing Challenges in AI-Assisted Child\n    Welfare Decision-Making through Worker-AI Interface Design Concepts.\n    ");
    			em12 = element("em");
    			em12.textContent = "ACM DIS 2022.";
    			t105 = space();
    			a19 = element("a");
    			a19.textContent = "[Article]";
    			t107 = space();
    			p12 = element("p");
    			t108 = text("Cheng, H., Stapleton, L., Kawakami, A., ");
    			strong12 = element("strong");
    			strong12.textContent = "Sivaraman, V.";
    			t110 = text(",\n    Cheng, Y., Qing, D., Perer, A., Holstein, K., Wu, S., Zhu, H. (2022). How\n    Child Welfare Workers Reduce Racial Disparities in Algorithmic Decisions.\n    ");
    			em13 = element("em");
    			em13.textContent = "ACM CHI 2022.";
    			t112 = space();
    			a20 = element("a");
    			a20.textContent = "[Article]";
    			t114 = space();
    			p13 = element("p");
    			t115 = text("Kawakami, A., ");
    			strong13 = element("strong");
    			strong13.textContent = "Sivaraman, V.";
    			t117 = text(", Cheng, H., Stapleton, L.,\n    Cheng, Y., Qing, D., Perer, A., Wu, S., Zhu, H., Holstein, K. (2022).\n    Improving Human-AI Partnerships in Child Welfare: Understanding Worker\n    Practices, Challenges, and Desires for Algorithmic Decision Support.\n    ");
    			em14 = element("em");
    			em14.textContent = "ACM CHI 2022.";
    			t119 = space();
    			a21 = element("a");
    			a21.textContent = "[Preprint]";
    			t121 = space();
    			a22 = element("a");
    			a22.textContent = "[Article]";
    			t123 = space();
    			p14 = element("p");
    			strong14 = element("strong");
    			strong14.textContent = "Sivaraman, V.";
    			t125 = text(", Wu, Y., & Perer, A. (2022). Emblaze:\n    Illuminating machine learning representations through interactive comparison\n    of embedding spaces. ");
    			em15 = element("em");
    			em15.textContent = "ACM IUI 2022.";
    			t127 = space();
    			a23 = element("a");
    			a23.textContent = "[Video]";
    			t129 = space();
    			a24 = element("a");
    			a24.textContent = "[GitHub]";
    			t131 = space();
    			a25 = element("a");
    			a25.textContent = "[Article]";
    			t133 = space();
    			p15 = element("p");
    			t134 = text("Swanson, S., ");
    			strong15 = element("strong");
    			strong15.textContent = "Sivaraman, V.";
    			t136 = text(", Grigoryan, G., Keating, A.\n    (2022). Tertiary motifs as building blocks for the design of protein-binding\n    peptides. ");
    			em16 = element("em");
    			em16.textContent = "To appear in Protein Science.";
    			t138 = space();
    			h25 = element("h2");
    			h25.textContent = "2021";
    			t140 = space();
    			p16 = element("p");
    			t141 = text("Wu, J., ");
    			strong16 = element("strong");
    			strong16.textContent = "Sivaraman, V.";
    			t143 = text(", Kumar, D. (first three authors equal\n    contribution), Banda, J. M., & Sontag, D. (2021). Pulse of the pandemic:\n    Iterative topic filtering for clinical information extraction from social\n    media. ");
    			em17 = element("em");
    			em17.textContent = "Journal of Biomedical Informatics.";
    			t145 = space();
    			a26 = element("a");
    			a26.textContent = "[Article]";
    			t147 = space();
    			a27 = element("a");
    			a27.textContent = "[Preprint]";
    			t149 = space();
    			p17 = element("p");
    			t150 = text("Newman-Griffis, D., ");
    			strong17 = element("strong");
    			strong17.textContent = "Sivaraman, V.";
    			t152 = text(", Perer, A.,\n    Fosler-Lussier, E., & Hochheiser, H. (2021). TextEssence: A Tool for\n    Interactive Analysis of Semantic Shifts Between Corpora.\n    ");
    			em18 = element("em");
    			em18.textContent = "NAACL Systems Demonstration.";
    			t154 = space();
    			a28 = element("a");
    			a28.textContent = "[Demo]";
    			t156 = space();
    			a29 = element("a");
    			a29.textContent = "[Article]";
    			t158 = space();
    			a30 = element("a");
    			a30.textContent = "[Preprint]";
    			t160 = space();
    			p18 = element("p");
    			t161 = text("Hwang, T., Parker, S. S., Hill, S. M., Ilunga, M. W., Grant, R. A.,\n    ");
    			strong18 = element("strong");
    			strong18.textContent = "Sivaraman, V.";
    			t163 = text(", Mouneimne, G., & Keating, A. E. (2021). A\n    proteome-wide screen uncovers diverse roles for sequence context surrounding\n    proline-rich motifs in Ena/VASP molecular recognition.\n    ");
    			em19 = element("em");
    			em19.textContent = "Under review.";
    			t165 = space();
    			a31 = element("a");
    			a31.textContent = "[Preprint]";
    			t167 = space();
    			h26 = element("h2");
    			h26.textContent = "Older";
    			t169 = space();
    			p19 = element("p");
    			strong19 = element("strong");
    			strong19.textContent = "Sivaraman, V.";
    			t171 = text(", Yoon, D., & Mitros, P. (2016). Simplified\n    audio production in asynchronous voice-based discussions.\n    ");
    			em20 = element("em");
    			em20.textContent = "ACM CHI 2016.";
    			t173 = space();
    			a32 = element("a");
    			a32.textContent = "[Article]";
    			attr_dev(span, "class", "fw2");
    			add_location(span, file$3, 1, 22, 39);
    			attr_dev(h1, "class", "mt2");
    			add_location(h1, file$3, 0, 0, 0);
    			add_location(h20, file$3, 5, 2, 125);
    			add_location(strong0, file$3, 7, 4, 149);
    			add_location(em0, file$3, 10, 4, 331);
    			attr_dev(a0, "class", "link blue");
    			attr_dev(a0, "href", "https://arxiv.org/abs/2609.19318");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$3, 11, 4, 358);
    			add_location(p0, file$3, 6, 2, 141);
    			add_location(strong1, file$3, 16, 27, 502);
    			add_location(em1, file$3, 18, 4, 623);
    			attr_dev(a1, "class", "link blue");
    			attr_dev(a1, "href", "https://arxiv.org/abs/2605.07002");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$3, 19, 4, 663);
    			add_location(p1, file$3, 15, 2, 471);
    			add_location(strong2, file$3, 24, 4, 784);
    			add_location(em2, file$3, 27, 4, 999);
    			attr_dev(a2, "class", "link blue");
    			attr_dev(a2, "href", "https://arxiv.org/abs/2602.00259");
    			attr_dev(a2, "target", "_blank");
    			add_location(a2, file$3, 28, 4, 1026);
    			attr_dev(a3, "class", "link blue");
    			attr_dev(a3, "href", "https://github.com/cmudig/sepsis-reasoning-dashboard");
    			attr_dev(a3, "target", "_blank");
    			add_location(a3, file$3, 31, 4, 1134);
    			add_location(p2, file$3, 23, 2, 776);
    			add_location(h21, file$3, 37, 2, 1276);
    			add_location(strong3, file$3, 39, 36, 1332);
    			add_location(em3, file$3, 42, 4, 1466);
    			attr_dev(a4, "class", "link blue");
    			attr_dev(a4, "href", "https://arxiv.org/abs/2511.09337");
    			attr_dev(a4, "target", "_blank");
    			add_location(a4, file$3, 43, 4, 1520);
    			attr_dev(a5, "class", "link blue");
    			attr_dev(a5, "href", "https://github.com/cmudig/tempo-ql");
    			attr_dev(a5, "target", "_blank");
    			add_location(a5, file$3, 46, 4, 1625);
    			attr_dev(a6, "class", "link blue");
    			attr_dev(a6, "href", "http://tempoql-demo.uk.r.appspot.com/");
    			attr_dev(a6, "target", "_blank");
    			add_location(a6, file$3, 51, 4, 1744);
    			add_location(p3, file$3, 38, 2, 1292);
    			add_location(strong4, file$3, 58, 4, 1877);
    			add_location(em4, file$3, 61, 4, 2091);
    			attr_dev(a7, "class", "link blue");
    			attr_dev(a7, "href", "https://arxiv.org/abs/2502.10526");
    			attr_dev(a7, "target", "_blank");
    			add_location(a7, file$3, 62, 4, 2118);
    			attr_dev(a8, "class", "link blue");
    			attr_dev(a8, "href", "https://github.com/cmudig/tempo");
    			attr_dev(a8, "target", "_blank");
    			add_location(a8, file$3, 65, 4, 2226);
    			add_location(p4, file$3, 57, 2, 1869);
    			add_location(strong5, file$3, 70, 4, 2344);
    			add_location(em5, file$3, 72, 4, 2491);
    			attr_dev(a9, "class", "link blue");
    			attr_dev(a9, "href", "https://arxiv.org/abs/2502.10537");
    			attr_dev(a9, "target", "_blank");
    			add_location(a9, file$3, 73, 4, 2518);
    			attr_dev(a10, "class", "link blue");
    			attr_dev(a10, "href", "https://github.com/cmudig/divisi-toolkit");
    			attr_dev(a10, "target", "_blank");
    			add_location(a10, file$3, 76, 4, 2626);
    			add_location(p5, file$3, 69, 2, 2336);
    			add_location(strong6, file$3, 83, 4, 2764);
    			add_location(em6, file$3, 86, 34, 3027);
    			attr_dev(a11, "class", "link blue");
    			attr_dev(a11, "href", "https://arxiv.org/abs/2502.10542");
    			attr_dev(a11, "target", "_blank");
    			add_location(a11, file$3, 87, 4, 3055);
    			add_location(p6, file$3, 82, 2, 2756);
    			add_location(h22, file$3, 91, 2, 3168);
    			add_location(strong7, file$3, 93, 17, 3205);
    			add_location(em7, file$3, 96, 4, 3425);
    			attr_dev(a12, "class", "link blue");
    			attr_dev(a12, "href", "https://ieeexplore.ieee.org/document/10672545");
    			attr_dev(a12, "target", "_blank");
    			add_location(a12, file$3, 97, 4, 3453);
    			attr_dev(a13, "class", "link blue");
    			attr_dev(a13, "href", "https://arxiv.org/abs/2408.03274");
    			attr_dev(a13, "target", "_blank");
    			add_location(a13, file$3, 102, 4, 3584);
    			attr_dev(a14, "class", "link blue");
    			attr_dev(a14, "href", "https://github.com/apple/ml-compress-and-compare");
    			attr_dev(a14, "target", "_blank");
    			add_location(a14, file$3, 105, 4, 3692);
    			add_location(p7, file$3, 92, 2, 3184);
    			add_location(strong8, file$3, 112, 4, 3838);
    			add_location(em8, file$3, 114, 4, 3985);
    			attr_dev(a15, "class", "link blue");
    			attr_dev(a15, "href", "https://dig.cmu.edu/counterpoint");
    			attr_dev(a15, "target", "_blank");
    			add_location(a15, file$3, 115, 4, 4013);
    			attr_dev(a16, "class", "link blue");
    			attr_dev(a16, "href", "https://github.com/cmudig/counterpoint");
    			attr_dev(a16, "target", "_blank");
    			add_location(a16, file$3, 118, 4, 4126);
    			add_location(p8, file$3, 111, 2, 3830);
    			add_location(strong9, file$3, 125, 14, 4272);
    			add_location(em9, file$3, 128, 4, 4439);
    			attr_dev(a17, "class", "link blue");
    			attr_dev(a17, "href", "https://arxiv.org/abs/2404.07148");
    			attr_dev(a17, "target", "_blank");
    			add_location(a17, file$3, 129, 4, 4506);
    			add_location(p9, file$3, 124, 2, 4254);
    			add_location(h23, file$3, 133, 2, 4618);
    			add_location(strong10, file$3, 135, 4, 4642);
    			add_location(em10, file$3, 138, 4, 4851);
    			attr_dev(a18, "class", "link blue");
    			attr_dev(a18, "href", "https://arxiv.org/abs/2302.00096");
    			attr_dev(a18, "target", "_blank");
    			add_location(a18, file$3, 139, 4, 4878);
    			add_location(p10, file$3, 134, 2, 4634);
    			add_location(h24, file$3, 143, 2, 4990);
    			add_location(strong11, file$3, 145, 18, 5028);
    			add_location(em11, file$3, 145, 49, 5059);
    			add_location(em12, file$3, 149, 4, 5320);
    			attr_dev(a19, "class", "link blue");
    			attr_dev(a19, "href", "https://dl.acm.org/doi/10.1145/3532106.3533556");
    			attr_dev(a19, "target", "_blank");
    			add_location(a19, file$3, 150, 4, 5347);
    			add_location(p11, file$3, 144, 2, 5006);
    			add_location(strong12, file$3, 157, 44, 5532);
    			add_location(em13, file$3, 160, 4, 5724);
    			attr_dev(a20, "class", "link blue");
    			attr_dev(a20, "href", "https://dl.acm.org/doi/10.1145/3491102.3501831");
    			attr_dev(a20, "target", "_blank");
    			add_location(a20, file$3, 161, 4, 5751);
    			add_location(p12, file$3, 156, 2, 5484);
    			add_location(strong13, file$3, 168, 18, 5910);
    			add_location(em14, file$3, 172, 4, 6194);
    			attr_dev(a21, "class", "link blue");
    			attr_dev(a21, "href", "https://arxiv.org/abs/2204.02310");
    			attr_dev(a21, "target", "_blank");
    			add_location(a21, file$3, 173, 4, 6221);
    			attr_dev(a22, "class", "link blue");
    			attr_dev(a22, "href", "https://dl.acm.org/doi/10.1145/3491102.3517439");
    			attr_dev(a22, "target", "_blank");
    			add_location(a22, file$3, 176, 4, 6329);
    			add_location(p13, file$3, 167, 2, 5888);
    			add_location(strong14, file$3, 183, 4, 6474);
    			add_location(em15, file$3, 185, 25, 6649);
    			attr_dev(a23, "class", "link blue");
    			attr_dev(a23, "href", "https://drive.google.com/file/d/1h7N73O4Q-d_9l9H5TT0V8VLqtlpWKsM7/view?usp=share_link");
    			attr_dev(a23, "target", "_blank");
    			add_location(a23, file$3, 186, 4, 6676);
    			attr_dev(a24, "class", "link blue");
    			attr_dev(a24, "href", "https://github.com/cmudig/emblaze");
    			attr_dev(a24, "target", "_blank");
    			add_location(a24, file$3, 191, 4, 6845);
    			attr_dev(a25, "class", "link blue");
    			attr_dev(a25, "href", "https://dl.acm.org/doi/10.1145/3490099.3511137");
    			attr_dev(a25, "target", "_blank");
    			add_location(a25, file$3, 196, 4, 6963);
    			add_location(p14, file$3, 182, 2, 6466);
    			add_location(strong15, file$3, 203, 17, 7121);
    			add_location(em16, file$3, 205, 14, 7275);
    			add_location(p15, file$3, 202, 2, 7100);
    			add_location(h25, file$3, 207, 2, 7323);
    			add_location(strong16, file$3, 209, 12, 7355);
    			add_location(em17, file$3, 212, 11, 7590);
    			attr_dev(a26, "class", "link blue");
    			attr_dev(a26, "href", "https://www.sciencedirect.com/science/article/abs/pii/S1532046421001738");
    			attr_dev(a26, "target", "_blank");
    			add_location(a26, file$3, 213, 4, 7638);
    			attr_dev(a27, "class", "link blue");
    			attr_dev(a27, "href", "https://arxiv.org/abs/2102.06836");
    			attr_dev(a27, "target", "_blank");
    			add_location(a27, file$3, 218, 4, 7795);
    			add_location(p16, file$3, 208, 2, 7339);
    			add_location(strong17, file$3, 223, 24, 7936);
    			add_location(em18, file$3, 226, 4, 8117);
    			attr_dev(a28, "class", "link blue");
    			attr_dev(a28, "href", "https://textessence.dbmi.pitt.edu");
    			attr_dev(a28, "target", "_blank");
    			add_location(a28, file$3, 227, 4, 8161);
    			attr_dev(a29, "class", "link blue");
    			attr_dev(a29, "href", "https://aclanthology.org/2021.naacl-demos.13/");
    			attr_dev(a29, "target", "_blank");
    			add_location(a29, file$3, 232, 4, 8277);
    			attr_dev(a30, "class", "link blue");
    			attr_dev(a30, "href", "https://arxiv.org/abs/2103.11029");
    			attr_dev(a30, "target", "_blank");
    			add_location(a30, file$3, 237, 4, 8408);
    			add_location(p17, file$3, 222, 2, 7908);
    			add_location(strong18, file$3, 243, 4, 8601);
    			add_location(em19, file$3, 246, 4, 8819);
    			attr_dev(a31, "class", "link blue");
    			attr_dev(a31, "href", "https://www.biorxiv.org/content/10.1101/2021.03.22.436451v1");
    			attr_dev(a31, "target", "_blank");
    			add_location(a31, file$3, 247, 4, 8846);
    			add_location(p18, file$3, 241, 2, 8521);
    			add_location(h26, file$3, 253, 2, 8997);
    			add_location(strong19, file$3, 255, 4, 9022);
    			add_location(em20, file$3, 257, 4, 9162);
    			attr_dev(a32, "class", "link blue");
    			attr_dev(a32, "href", "https://dl.acm.org/doi/10.1145/2858036.2858416");
    			attr_dev(a32, "target", "_blank");
    			add_location(a32, file$3, 258, 4, 9189);
    			add_location(p19, file$3, 254, 2, 9014);
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
    			append_dev(p0, a0);
    			append_dev(section, t10);
    			append_dev(section, p1);
    			append_dev(p1, t11);
    			append_dev(p1, strong1);
    			append_dev(p1, t13);
    			append_dev(p1, em1);
    			append_dev(p1, t15);
    			append_dev(p1, a1);
    			append_dev(section, t17);
    			append_dev(section, p2);
    			append_dev(p2, strong2);
    			append_dev(p2, t19);
    			append_dev(p2, em2);
    			append_dev(p2, t21);
    			append_dev(p2, a2);
    			append_dev(p2, t23);
    			append_dev(p2, a3);
    			append_dev(section, t25);
    			append_dev(section, h21);
    			append_dev(section, t27);
    			append_dev(section, p3);
    			append_dev(p3, t28);
    			append_dev(p3, strong3);
    			append_dev(p3, t30);
    			append_dev(p3, em3);
    			append_dev(p3, t32);
    			append_dev(p3, a4);
    			append_dev(p3, t34);
    			append_dev(p3, a5);
    			append_dev(p3, t36);
    			append_dev(p3, a6);
    			append_dev(section, t38);
    			append_dev(section, p4);
    			append_dev(p4, strong4);
    			append_dev(p4, t40);
    			append_dev(p4, em4);
    			append_dev(p4, t42);
    			append_dev(p4, a7);
    			append_dev(p4, t44);
    			append_dev(p4, a8);
    			append_dev(section, t46);
    			append_dev(section, p5);
    			append_dev(p5, strong5);
    			append_dev(p5, t48);
    			append_dev(p5, em5);
    			append_dev(p5, t50);
    			append_dev(p5, a9);
    			append_dev(p5, t52);
    			append_dev(p5, a10);
    			append_dev(section, t54);
    			append_dev(section, p6);
    			append_dev(p6, strong6);
    			append_dev(p6, t56);
    			append_dev(p6, em6);
    			append_dev(p6, t58);
    			append_dev(p6, a11);
    			append_dev(section, t60);
    			append_dev(section, h22);
    			append_dev(section, t62);
    			append_dev(section, p7);
    			append_dev(p7, t63);
    			append_dev(p7, strong7);
    			append_dev(p7, t65);
    			append_dev(p7, em7);
    			append_dev(p7, t67);
    			append_dev(p7, a12);
    			append_dev(p7, t69);
    			append_dev(p7, a13);
    			append_dev(p7, t71);
    			append_dev(p7, a14);
    			append_dev(section, t73);
    			append_dev(section, p8);
    			append_dev(p8, strong8);
    			append_dev(p8, t75);
    			append_dev(p8, em8);
    			append_dev(p8, t77);
    			append_dev(p8, a15);
    			append_dev(p8, t79);
    			append_dev(p8, a16);
    			append_dev(section, t81);
    			append_dev(section, p9);
    			append_dev(p9, t82);
    			append_dev(p9, strong9);
    			append_dev(p9, t84);
    			append_dev(p9, em9);
    			append_dev(p9, t86);
    			append_dev(p9, a17);
    			append_dev(section, t88);
    			append_dev(section, h23);
    			append_dev(section, t90);
    			append_dev(section, p10);
    			append_dev(p10, strong10);
    			append_dev(p10, t92);
    			append_dev(p10, em10);
    			append_dev(p10, t94);
    			append_dev(p10, a18);
    			append_dev(section, t96);
    			append_dev(section, h24);
    			append_dev(section, t98);
    			append_dev(section, p11);
    			append_dev(p11, t99);
    			append_dev(p11, strong11);
    			append_dev(p11, t101);
    			append_dev(p11, em11);
    			append_dev(p11, t103);
    			append_dev(p11, em12);
    			append_dev(p11, t105);
    			append_dev(p11, a19);
    			append_dev(section, t107);
    			append_dev(section, p12);
    			append_dev(p12, t108);
    			append_dev(p12, strong12);
    			append_dev(p12, t110);
    			append_dev(p12, em13);
    			append_dev(p12, t112);
    			append_dev(p12, a20);
    			append_dev(section, t114);
    			append_dev(section, p13);
    			append_dev(p13, t115);
    			append_dev(p13, strong13);
    			append_dev(p13, t117);
    			append_dev(p13, em14);
    			append_dev(p13, t119);
    			append_dev(p13, a21);
    			append_dev(p13, t121);
    			append_dev(p13, a22);
    			append_dev(section, t123);
    			append_dev(section, p14);
    			append_dev(p14, strong14);
    			append_dev(p14, t125);
    			append_dev(p14, em15);
    			append_dev(p14, t127);
    			append_dev(p14, a23);
    			append_dev(p14, t129);
    			append_dev(p14, a24);
    			append_dev(p14, t131);
    			append_dev(p14, a25);
    			append_dev(section, t133);
    			append_dev(section, p15);
    			append_dev(p15, t134);
    			append_dev(p15, strong15);
    			append_dev(p15, t136);
    			append_dev(p15, em16);
    			append_dev(section, t138);
    			append_dev(section, h25);
    			append_dev(section, t140);
    			append_dev(section, p16);
    			append_dev(p16, t141);
    			append_dev(p16, strong16);
    			append_dev(p16, t143);
    			append_dev(p16, em17);
    			append_dev(p16, t145);
    			append_dev(p16, a26);
    			append_dev(p16, t147);
    			append_dev(p16, a27);
    			append_dev(section, t149);
    			append_dev(section, p17);
    			append_dev(p17, t150);
    			append_dev(p17, strong17);
    			append_dev(p17, t152);
    			append_dev(p17, em18);
    			append_dev(p17, t154);
    			append_dev(p17, a28);
    			append_dev(p17, t156);
    			append_dev(p17, a29);
    			append_dev(p17, t158);
    			append_dev(p17, a30);
    			append_dev(section, t160);
    			append_dev(section, p18);
    			append_dev(p18, t161);
    			append_dev(p18, strong18);
    			append_dev(p18, t163);
    			append_dev(p18, em19);
    			append_dev(p18, t165);
    			append_dev(p18, a31);
    			append_dev(section, t167);
    			append_dev(section, h26);
    			append_dev(section, t169);
    			append_dev(section, p19);
    			append_dev(p19, strong19);
    			append_dev(p19, t171);
    			append_dev(p19, em20);
    			append_dev(p19, t173);
    			append_dev(p19, a32);
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

    // (14:2) <Card     url="https://www.youtube.com/playlist?list=PLKLtP4RGT8N33oqQOeC5sTMzTJcYx699C"     videoSrc="https://www.youtube.com/embed/PygP6bV5BTM?si=2H7gFow7GGPEMc30"   >
    function create_default_slot_7(ctx) {
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
    	let a;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text("Ravel: ");
    			span = element("span");
    			span.textContent = "Miroirs";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "October 2025";
    			t4 = space();
    			p1 = element("p");
    			t5 = text("Venkat's last solo recital at CMU, in collaboration with Prof. Sergey\n      Schepkin, features Ravel's ");
    			em = element("em");
    			em.textContent = "Miroirs";
    			t7 = text(".\n      ");
    			a = element("a");
    			a.textContent = "Click to view the playlist.";
    			attr_dev(span, "class", "fw3 ml1");
    			add_location(span, file$2, 18, 13, 592);
    			attr_dev(h3, "class", "mb0 lh-title");
    			add_location(h3, file$2, 17, 4, 553);
    			attr_dev(p0, "class", "gray mv0");
    			add_location(p0, file$2, 20, 4, 643);
    			add_location(em, file$2, 23, 33, 813);
    			attr_dev(a, "class", "link blue");
    			attr_dev(a, "href", "https://www.youtube.com/playlist?list=PLKLtP4RGT8N33oqQOeC5sTMzTJcYx699C");
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$2, 24, 6, 837);
    			attr_dev(p1, "class", "lh-copy");
    			add_location(p1, file$2, 21, 4, 684);
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
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(14:2) <Card     url=\\\"https://www.youtube.com/playlist?list=PLKLtP4RGT8N33oqQOeC5sTMzTJcYx699C\\\"     videoSrc=\\\"https://www.youtube.com/embed/PygP6bV5BTM?si=2H7gFow7GGPEMc30\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (32:2) <Card     url="https://www.youtube.com/watch?v=1mqnrWxZ-xw"     videoSrc="https://www.youtube.com/embed/1mqnrWxZ-xw"   >
    function create_default_slot_6(ctx) {
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
    			add_location(span, file$2, 36, 15, 1204);
    			attr_dev(h3, "class", "mb0 lh-title");
    			add_location(h3, file$2, 35, 4, 1163);
    			attr_dev(p0, "class", "gray mv0");
    			add_location(p0, file$2, 38, 4, 1256);
    			add_location(em, file$2, 40, 32, 1350);
    			attr_dev(p1, "class", "lh-copy");
    			add_location(p1, file$2, 39, 4, 1298);
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
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(32:2) <Card     url=\\\"https://www.youtube.com/watch?v=1mqnrWxZ-xw\\\"     videoSrc=\\\"https://www.youtube.com/embed/1mqnrWxZ-xw\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (44:2) <Card     url="https://www.youtube.com/watch?v=Fm-r7pBj0Us"     videoSrc="https://www.youtube.com/embed/Fm-r7pBj0Us"   >
    function create_default_slot_5(ctx) {
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
    			add_location(span, file$2, 48, 13, 1588);
    			attr_dev(h3, "class", "mb0 lh-title");
    			add_location(h3, file$2, 47, 4, 1549);
    			attr_dev(p0, "class", "gray mv0");
    			add_location(p0, file$2, 50, 4, 1652);
    			add_location(em, file$2, 52, 30, 1744);
    			attr_dev(p1, "class", "lh-copy");
    			add_location(p1, file$2, 51, 4, 1694);
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
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(44:2) <Card     url=\\\"https://www.youtube.com/watch?v=Fm-r7pBj0Us\\\"     videoSrc=\\\"https://www.youtube.com/embed/Fm-r7pBj0Us\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (57:2) <Card     url="https://www.youtube.com/watch?v=AjKWi564EIY"     videoSrc="https://www.youtube.com/embed/AjKWi564EIY"   >
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
    			add_location(span, file$2, 61, 19, 2006);
    			attr_dev(h3, "class", "mb0 lh-title");
    			add_location(h3, file$2, 60, 4, 1961);
    			attr_dev(p0, "class", "gray mv0");
    			add_location(p0, file$2, 63, 4, 2059);
    			attr_dev(p1, "class", "lh-copy");
    			add_location(p1, file$2, 64, 4, 2101);
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
    		source: "(57:2) <Card     url=\\\"https://www.youtube.com/watch?v=AjKWi564EIY\\\"     videoSrc=\\\"https://www.youtube.com/embed/AjKWi564EIY\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (70:2) <Card     url="https://www.youtube.com/watch?v=Ulj9CzxSgwU"     videoSrc="https://www.youtube.com/embed/Ulj9CzxSgwU"   >
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
    			add_location(span, file$2, 74, 20, 2472);
    			attr_dev(h3, "class", "mb0 lh-title");
    			add_location(h3, file$2, 73, 4, 2426);
    			attr_dev(p0, "class", "gray mv0");
    			add_location(p0, file$2, 76, 4, 2525);
    			attr_dev(p1, "class", "lh-copy");
    			add_location(p1, file$2, 77, 4, 2562);
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
    		source: "(70:2) <Card     url=\\\"https://www.youtube.com/watch?v=Ulj9CzxSgwU\\\"     videoSrc=\\\"https://www.youtube.com/embed/Ulj9CzxSgwU\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (83:2) <Card     url="https://www.youtube.com/watch?v=sldyqayzrKw"     videoSrc="https://www.youtube.com/embed/sldyqayzrKw"   >
    function create_default_slot_2(ctx) {
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
    			add_location(span, file$2, 87, 17, 2909);
    			attr_dev(h3, "class", "mb0 lh-title");
    			add_location(h3, file$2, 86, 4, 2866);
    			attr_dev(p0, "class", "gray mv0");
    			add_location(p0, file$2, 89, 4, 2969);
    			attr_dev(p1, "class", "lh-copy");
    			add_location(p1, file$2, 90, 4, 3008);
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
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(83:2) <Card     url=\\\"https://www.youtube.com/watch?v=sldyqayzrKw\\\"     videoSrc=\\\"https://www.youtube.com/embed/sldyqayzrKw\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (96:2) <Card     url="https://www.youtube.com/watch?v=PyQaq62N_fI"     videoSrc="https://www.youtube.com/embed/PyQaq62N_fI"   >
    function create_default_slot_1(ctx) {
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
    			add_location(span, file$2, 100, 20, 3322);
    			attr_dev(h3, "class", "mb0 lh-title");
    			add_location(h3, file$2, 99, 4, 3276);
    			attr_dev(p0, "class", "gray mv0");
    			add_location(p0, file$2, 102, 4, 3382);
    			attr_dev(a0, "class", "link blue");
    			attr_dev(a0, "href", "https://www.youtube.com/watch?v=RUwITozfR74");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$2, 107, 6, 3625);
    			attr_dev(a1, "class", "link blue");
    			attr_dev(a1, "href", "https://www.youtube.com/watch?v=0dqsxVFovXo");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$2, 113, 6, 3771);
    			attr_dev(p1, "class", "lh-copy");
    			add_location(p1, file$2, 103, 4, 3419);
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
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(96:2) <Card     url=\\\"https://www.youtube.com/watch?v=PyQaq62N_fI\\\"     videoSrc=\\\"https://www.youtube.com/embed/PyQaq62N_fI\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (121:2) <Card     url="https://www.youtube.com/watch?v=PyQaq62N_fI"     videoSrc="https://www.youtube.com/embed/PyQaq62N_fI"   >
    function create_default_slot(ctx) {
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
    			add_location(span, file$2, 125, 13, 4103);
    			attr_dev(h3, "class", "mb0 lh-title");
    			add_location(h3, file$2, 124, 4, 4064);
    			attr_dev(p0, "class", "gray mv0");
    			add_location(p0, file$2, 127, 4, 4165);
    			add_location(em, file$2, 129, 48, 4272);
    			attr_dev(a0, "class", "link blue");
    			attr_dev(a0, "href", "https://www.youtube.com/watch?v=-iSp0s9zpUE");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$2, 131, 6, 4381);
    			attr_dev(a1, "class", "link blue");
    			attr_dev(a1, "href", "https://www.youtube.com/watch?v=cULwYsX6Q88");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$2, 137, 6, 4527);
    			attr_dev(p1, "class", "lh-copy");
    			add_location(p1, file$2, 128, 4, 4204);
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
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(121:2) <Card     url=\\\"https://www.youtube.com/watch?v=PyQaq62N_fI\\\"     videoSrc=\\\"https://www.youtube.com/embed/PyQaq62N_fI\\\"   >",
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
    	let current;

    	card0 = new Card({
    			props: {
    				url: "https://www.youtube.com/playlist?list=PLKLtP4RGT8N33oqQOeC5sTMzTJcYx699C",
    				videoSrc: "https://www.youtube.com/embed/PygP6bV5BTM?si=2H7gFow7GGPEMc30",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card1 = new Card({
    			props: {
    				url: "https://www.youtube.com/watch?v=1mqnrWxZ-xw",
    				videoSrc: "https://www.youtube.com/embed/1mqnrWxZ-xw",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card2 = new Card({
    			props: {
    				url: "https://www.youtube.com/watch?v=Fm-r7pBj0Us",
    				videoSrc: "https://www.youtube.com/embed/Fm-r7pBj0Us",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card3 = new Card({
    			props: {
    				url: "https://www.youtube.com/watch?v=AjKWi564EIY",
    				videoSrc: "https://www.youtube.com/embed/AjKWi564EIY",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card4 = new Card({
    			props: {
    				url: "https://www.youtube.com/watch?v=Ulj9CzxSgwU",
    				videoSrc: "https://www.youtube.com/embed/Ulj9CzxSgwU",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card5 = new Card({
    			props: {
    				url: "https://www.youtube.com/watch?v=sldyqayzrKw",
    				videoSrc: "https://www.youtube.com/embed/sldyqayzrKw",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card6 = new Card({
    			props: {
    				url: "https://www.youtube.com/watch?v=PyQaq62N_fI",
    				videoSrc: "https://www.youtube.com/embed/PyQaq62N_fI",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card7 = new Card({
    			props: {
    				url: "https://www.youtube.com/watch?v=PyQaq62N_fI",
    				videoSrc: "https://www.youtube.com/embed/PyQaq62N_fI",
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
    			attr_dev(span, "class", "fw2");
    			add_location(span, file$2, 5, 22, 95);
    			attr_dev(h1, "class", "mt2");
    			add_location(h1, file$2, 4, 0, 56);
    			attr_dev(p, "class", "lh-copy measure f5");
    			add_location(p, file$2, 7, 0, 132);
    			attr_dev(div, "class", "card-container svelte-153zum2");
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
    var faPaperclip = {
      prefix: 'fas',
      iconName: 'paperclip',
      icon: [448, 512, [], "f0c6", "M43.246 466.142c-58.43-60.289-57.341-157.511 1.386-217.581L254.392 34c44.316-45.332 116.351-45.336 160.671 0 43.89 44.894 43.943 117.329 0 162.276L232.214 383.128c-29.855 30.537-78.633 30.111-107.982-.998-28.275-29.97-27.368-77.473 1.452-106.953l143.743-146.835c6.182-6.314 16.312-6.422 22.626-.241l22.861 22.379c6.315 6.182 6.422 16.312.241 22.626L171.427 319.927c-4.932 5.045-5.236 13.428-.648 18.292 4.372 4.634 11.245 4.711 15.688.165l182.849-186.851c19.613-20.062 19.613-52.725-.011-72.798-19.189-19.627-49.957-19.637-69.154 0L90.39 293.295c-34.763 35.56-35.299 93.12-1.191 128.313 34.01 35.093 88.985 35.137 123.058.286l172.06-175.999c6.177-6.319 16.307-6.433 22.626-.256l22.877 22.364c6.319 6.177 6.434 16.307.256 22.626l-172.06 175.998c-59.576 60.938-155.943 60.216-214.77-.485z"]
    };

    const faGoogleScholar = {
      prefix: 'fab',
      iconName: 'google-scholar',
      icon: [512, 512, [], "e63b", "M390.9 298.5c0 0 0 .1 .1 .1c9.2 19.4 14.4 41.1 14.4 64C405.3 445.1 338.5 512 256 512s-149.3-66.9-149.3-149.3c0-22.9 5.2-44.6 14.4-64h0c1.7-3.6 3.6-7.2 5.6-10.7c4.4-7.6 9.4-14.7 15-21.3c27.4-32.6 68.5-53.3 114.4-53.3c33.6 0 64.6 11.1 89.6 29.9c9.1 6.9 17.4 14.7 24.8 23.5c5.6 6.6 10.6 13.8 15 21.3c2 3.4 3.8 7 5.5 10.5zm26.4-18.8c-30.1-58.4-91-98.4-161.3-98.4s-131.2 40-161.3 98.4L0 202.7 256 0 512 202.7l-94.7 77.1z"]
    };
    const faGithub = {
      prefix: 'fab',
      iconName: 'github',
      icon: [496, 512, [], "f09b", "M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"]
    };

    /* src/App.svelte generated by Svelte v3.46.3 */

    const { console: console_1 } = globals;
    const file = "src/App.svelte";

    // (170:29) 
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
    			footer.textContent = "Copyright 2026 Venkatesh Sivaraman.";
    			attr_dev(footer, "class", "gray svelte-awkk6r");
    			add_location(footer, file, 177, 6, 5028);
    			attr_dev(div, "class", "document svelte-awkk6r");
    			add_location(div, file, 170, 4, 4840);
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
    		source: "(170:29) ",
    		ctx
    	});

    	return block;
    }

    // (160:29) 
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
    			footer.textContent = "Copyright 2026 Venkatesh Sivaraman.";
    			attr_dev(footer, "class", "gray svelte-awkk6r");
    			add_location(footer, file, 167, 6, 4729);
    			attr_dev(div, "class", "document svelte-awkk6r");
    			add_location(div, file, 160, 4, 4536);
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
    		source: "(160:29) ",
    		ctx
    	});

    	return block;
    }

    // (150:29) 
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
    			footer.textContent = "Copyright 2026 Venkatesh Sivaraman.";
    			attr_dev(footer, "class", "gray svelte-awkk6r");
    			add_location(footer, file, 157, 6, 4425);
    			attr_dev(div, "class", "document svelte-awkk6r");
    			add_location(div, file, 150, 4, 4230);
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
    		source: "(150:29) ",
    		ctx
    	});

    	return block;
    }

    // (140:29) 
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
    			footer.textContent = "Copyright 2026 Venkatesh Sivaraman.";
    			attr_dev(footer, "class", "gray svelte-awkk6r");
    			add_location(footer, file, 147, 6, 4119);
    			attr_dev(div, "class", "document svelte-awkk6r");
    			add_location(div, file, 140, 4, 3928);
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
    		source: "(140:29) ",
    		ctx
    	});

    	return block;
    }

    // (130:2) {#if $visibleTab == 0}
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
    			footer.textContent = "Copyright 2026 Venkatesh Sivaraman.";
    			attr_dev(footer, "class", "gray svelte-awkk6r");
    			add_location(footer, file, 137, 6, 3817);
    			attr_dev(div, "class", "document svelte-awkk6r");
    			add_location(div, file, 130, 4, 3596);
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
    		source: "(130:2) {#if $visibleTab == 0}",
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
    	let li7;
    	let a7;
    	let fa2;
    	let t15;
    	let t16;
    	let li8;
    	let a8;
    	let fa3;
    	let t17;
    	let t18;
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
    			props: { icon: faGoogleScholar },
    			$$inline: true
    		});

    	fa2 = new Fa({
    			props: { icon: faPaperclip },
    			$$inline: true
    		});

    	fa3 = new Fa({
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
    			t13 = text("    Google Scholar");
    			t14 = space();
    			li7 = element("li");
    			a7 = element("a");
    			create_component(fa2.$$.fragment);
    			t15 = text("    CV");
    			t16 = space();
    			li8 = element("li");
    			a8 = element("a");
    			create_component(fa3.$$.fragment);
    			t17 = text("    Contact");
    			t18 = space();
    			if (if_block) if_block.c();
    			attr_dev(img, "class", "profile-pic dim pointer svelte-awkk6r");
    			if (!src_url_equal(img.src, img_src_value = "assets/profile.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Picture of Venkat in Seattle, Washington");
    			add_location(img, file, 48, 6, 1213);
    			attr_dev(a0, "class", "svelte-awkk6r");
    			toggle_class(a0, "active-link", /*$visibleTab*/ ctx[1] == 0);
    			toggle_class(a0, "link", /*$visibleTab*/ ctx[1] != 0);
    			add_location(a0, file, 56, 10, 1453);
    			attr_dev(li0, "class", "svelte-awkk6r");
    			add_location(li0, file, 55, 8, 1438);
    			attr_dev(a1, "class", "svelte-awkk6r");
    			toggle_class(a1, "active-link", /*$visibleTab*/ ctx[1] == 1);
    			toggle_class(a1, "link", /*$visibleTab*/ ctx[1] != 1);
    			add_location(a1, file, 63, 10, 1647);
    			attr_dev(li1, "class", "svelte-awkk6r");
    			add_location(li1, file, 62, 8, 1632);
    			attr_dev(a2, "class", "svelte-awkk6r");
    			toggle_class(a2, "active-link", /*$visibleTab*/ ctx[1] == 2);
    			toggle_class(a2, "link", /*$visibleTab*/ ctx[1] != 2);
    			add_location(a2, file, 70, 10, 1844);
    			attr_dev(li2, "class", "svelte-awkk6r");
    			add_location(li2, file, 69, 8, 1829);
    			attr_dev(a3, "class", "svelte-awkk6r");
    			toggle_class(a3, "active-link", /*$visibleTab*/ ctx[1] == 3);
    			toggle_class(a3, "link", /*$visibleTab*/ ctx[1] != 3);
    			add_location(a3, file, 77, 10, 2045);
    			attr_dev(li3, "class", "svelte-awkk6r");
    			add_location(li3, file, 76, 8, 2030);
    			attr_dev(a4, "class", "svelte-awkk6r");
    			toggle_class(a4, "active-link", /*$visibleTab*/ ctx[1] == 4);
    			toggle_class(a4, "link", /*$visibleTab*/ ctx[1] != 4);
    			add_location(a4, file, 84, 10, 2244);
    			attr_dev(li4, "class", "svelte-awkk6r");
    			add_location(li4, file, 83, 8, 2229);
    			attr_dev(a5, "class", "link contact-link flex items-center svelte-awkk6r");
    			attr_dev(a5, "href", "https://github.com/venkatesh-sivaraman");
    			attr_dev(a5, "target", "_blank");
    			add_location(a5, file, 91, 10, 2450);
    			attr_dev(li5, "class", "mt1 svelte-awkk6r");
    			add_location(li5, file, 90, 8, 2423);
    			attr_dev(a6, "class", "link contact-link flex items-center svelte-awkk6r");
    			attr_dev(a6, "href", "https://scholar.google.com/citations?user=KDcGcfAAAAAJ");
    			attr_dev(a6, "target", "_blank");
    			add_location(a6, file, 100, 10, 2726);
    			attr_dev(li6, "class", "mt1 svelte-awkk6r");
    			add_location(li6, file, 99, 8, 2699);
    			attr_dev(a7, "class", "link contact-link flex items-center svelte-awkk6r");
    			attr_dev(a7, "href", "/assets/venkats_cv.pdf");
    			attr_dev(a7, "target", "_blank");
    			add_location(a7, file, 109, 10, 3033);
    			attr_dev(li7, "class", "mt1 svelte-awkk6r");
    			add_location(li7, file, 108, 8, 3006);
    			attr_dev(a8, "class", "link contact-link flex items-center svelte-awkk6r");
    			attr_dev(a8, "href", "mailto:venkatesh.sivaraman@ucsf.edu");
    			attr_dev(a8, "target", "_blank");
    			add_location(a8, file, 118, 10, 3292);
    			attr_dev(li8, "class", "mt1 svelte-awkk6r");
    			add_location(li8, file, 117, 8, 3265);
    			attr_dev(ul, "class", "list nav-list pl0 svelte-awkk6r");
    			add_location(ul, file, 54, 6, 1399);
    			attr_dev(div, "class", "nav-container svelte-awkk6r");
    			add_location(div, file, 47, 4, 1179);
    			attr_dev(aside, "class", "svelte-awkk6r");
    			add_location(aside, file, 46, 2, 1167);
    			attr_dev(main, "class", "sans-serif svelte-awkk6r");
    			add_location(main, file, 45, 0, 1139);
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
    			append_dev(ul, t14);
    			append_dev(ul, li7);
    			append_dev(li7, a7);
    			mount_component(fa2, a7, null);
    			append_dev(a7, t15);
    			append_dev(ul, t16);
    			append_dev(ul, li8);
    			append_dev(li8, a8);
    			mount_component(fa3, a8, null);
    			append_dev(a8, t17);
    			append_dev(main, t18);

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
    			transition_in(fa2.$$.fragment, local);
    			transition_in(fa3.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fa0.$$.fragment, local);
    			transition_out(fa1.$$.fragment, local);
    			transition_out(fa2.$$.fragment, local);
    			transition_out(fa3.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(fa0);
    			destroy_component(fa1);
    			destroy_component(fa2);
    			destroy_component(fa3);

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
    		faPaperclip,
    		faGithub,
    		faGoogleScholar,
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
