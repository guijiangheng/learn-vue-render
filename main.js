const createRenderer = ({
  createElement,
  setElementText,
  insert,
  patchProps,
}) => {
  const mountElement = (vnode, container) => {
    const el = createElement(vnode.type);

    vnode.el = el;

    if (vnode.props) {
      for (const key in vnode.props) {
        patchProps(el, key, null, vnode.props[key]);
      }
    }

    if (typeof vnode.children === "string") {
      setElementText(el, vnode.children);
    } else if (Array.isArray(vnode.children)) {
      vnode.children.forEach((child) => {
        patch(null, child, el);
      });
    }

    insert(container, el);
  };

  const patch = (n1, n2, container) => {
    if (n1 && n1.type !== n2.type) {
      unmount(n1);
      n1 = null;
    }

    if (!n1) {
      mountElement(n2, container);
    } else {
      // Todo
    }
  };

  const unmount = (vnode) => {
    const parent = vnode.$el.parent;
    parent.removeChild(vnode.$el);
  };

  const render = (vnode, container) => {
    if (vnode) {
      patch(container.__vnode, vnode, container);
    } else if (container.__vnode) {
      unmount(container.__vnode);
    }

    container.__vnode = vnode;
  };

  return { render };
};

const shouldSetAsProp = (el, key) => {
  if (key === "form") return false;

  return key in el;
};

const renderer = createRenderer({
  createElement(tag) {
    return document.createElement(tag);
  },

  setElementText(el, text) {
    el.textContent = text;
  },

  insert(parent, el, anchor = null) {
    parent.insertBefore(el, anchor);
  },

  patchProps(el, key, prevProp, nextProp) {
    if (key === "class") {
      el.className = nextProp || "";
    } else if (shouldSetAsProp(el, key)) {
      if (typeof el[key] === "boolean" && nextProp === "") {
        el[key] = true;
      } else {
        el[key] = nextProp;
      }
    } else {
      el.setAttribute(key, nextProp);
    }
  },
});

renderer.render(
  {
    type: "h1",
    props: {
      id: "foo",
      class: "bar",
    },
    children: [
      {
        type: "p",
        children: "Hello Vite!",
      },
    ],
  },
  document.querySelector("#app")
);
