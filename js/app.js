"use strict";

/*
 * love-compliments — page logic.
 *
 * A jar of lines about Mena. Draw one, never the same twice in a row; add your
 * own; remove or reset. Everything is stored on this device.
 */

(function () {
  var STORE = "mena-compliments";

  var STARTER = [
    "You have the kind of laugh that makes a room braver.",
    "Your art has a style I'd recognise anywhere, even blindfolded.",
    "You listen like it's the most important thing you'll do all day.",
    "You look best in white, and somehow you already knew that.",
    "You argue with me until I'm better. That's a rare kind of love.",
    "You turn small ordinary moments into ones I keep.",
    "You're kind when nobody's watching — the real kind.",
    "Your face does this thing when you're concentrating. I could watch it for hours.",
    "You make me want to be more patient, more often.",
    "You're braver than you think you are, especially on the days you doubt it.",
    "You remember the little things I didn't know I said.",
    "You eat pizza with the seriousness it deserves.",
    "You're the only person I want to tell first, good news or bad.",
    "You have a way of making wherever you are feel like home.",
    "Your voice on a bad day still calms me down.",
    "You make art out of being alive. It's the most you thing about you."
  ];

  var state = { lines: [], lastId: null };

  /* ---------------- storage ---------------- */

  function load() {
    state.lines = [];
    state.lastId = null;
    var raw = null;
    try { raw = localStorage.getItem(STORE); } catch (e) { raw = null; }
    var s = null;
    if (raw) { try { s = JSON.parse(raw); } catch (e) { s = null; } }
    if (s && Array.isArray(s.lines) && s.lines.length) {
      s.lines.forEach(function (l) {
        if (l && typeof l.id === "string" && typeof l.text === "string" && l.text.trim()) {
          state.lines.push({
            id: l.id,
            text: l.text.trim().slice(0, 200),
            custom: !!l.custom
          });
        }
      });
      if (typeof s.lastId === "string") state.lastId = s.lastId;
    }
    if (!state.lines.length) {
      state.lines = STARTER.map(function (t, i) {
        return { id: "c" + (i + 1), text: t, custom: false };
      });
    }
  }

  function save() {
    try { localStorage.setItem(STORE, JSON.stringify({ lines: state.lines, lastId: state.lastId })); } catch (e) { /* ignore */ }
  }

  /* ---------------- helpers ---------------- */

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = String(value);
  }

  function note(msg) { setText("save-note", msg); }

  function el(tag, className) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  }

  function find(id) {
    for (var i = 0; i < state.lines.length; i += 1) {
      if (state.lines[i].id === id) return state.lines[i];
    }
    return null;
  }

  function nextId() {
    var max = 0;
    state.lines.forEach(function (l) {
      var n = parseInt(String(l.id).replace(/\D/g, ""), 10);
      if (n > max) max = n;
    });
    return "c" + (max + 1);
  }

  /* ---------------- actions ---------------- */

  function draw() {
    if (!state.lines.length) { note("The jar is empty \u2014 add a line first."); return null; }
    var pool = state.lines.length > 1
      ? state.lines.filter(function (l) { return l.id !== state.lastId; })
      : state.lines.slice();
    if (!pool.length) pool = state.lines.slice();
    var chosen = pool[Math.floor(Math.random() * pool.length)];
    state.lastId = chosen.id;
    save();

    var box = document.getElementById("jar-line");
    if (box) box.hidden = false;
    var hint = document.getElementById("jar-hint");
    if (hint) hint.hidden = true;
    setText("line-text", chosen.text);
    return chosen;
  }

  function addLine(text) {
    text = String(text || "").trim();
    if (!text) return false;
    state.lines.push({ id: nextId(), text: text.slice(0, 200), custom: true });
    save();
    render();
    return true;
  }

  function removeLine(id) {
    for (var i = 0; i < state.lines.length; i += 1) {
      if (state.lines[i].id === id) {
        var text = state.lines[i].text;
        state.lines.splice(i, 1);
        if (state.lastId === id) state.lastId = null;
        save();
        render();
        note("That line is out of the jar.");
        return text;
      }
    }
    return null;
  }

  function resetJar() {
    state.lines = STARTER.map(function (t, i) {
      return { id: "c" + (i + 1), text: t, custom: false };
    });
    state.lastId = null;
    save();
    render();
    note("Back to the original lines \u2665");
  }

  /* ---------------- rendering ---------------- */

  function renderList() {
    var list = document.getElementById("line-list");
    if (list) {
      list.textContent = "";
      if (!state.lines.length) {
        var empty = el("p", "line-empty");
        empty.textContent = "The jar is empty \u2014 add a line below.";
        list.appendChild(empty);
      } else {
        state.lines.slice().reverse().forEach(function (l) {
          var row = el("div", "line-item" + (l.custom ? " is-custom" : ""));
          row.setAttribute("data-id", l.id);
          row.appendChild(el("span", "line-text")).textContent = l.text;
          var rm = el("button", "line-remove");
          rm.type = "button";
          rm.textContent = "remove";
          rm.addEventListener("click", function () { removeLine(l.id); });
          row.appendChild(rm);
          list.appendChild(row);
        });
      }
    }
    setText("line-total", state.lines.length);
  }

  function render() { renderList(); }

  /* ---------------- wiring ---------------- */

  function wire() {
    var drawBtn = document.getElementById("jar-draw");
    if (drawBtn) drawBtn.addEventListener("click", function () { draw(); });

    var addBtn = document.getElementById("add-line");
    if (addBtn) addBtn.addEventListener("click", function () {
      var t = document.getElementById("add-text");
      if (!t || !String(t.value).trim()) {
        note("Write something first \u2665");
        return;
      }
      addLine(t.value);
      if (t) t.value = "";
      note("Dropped into the jar \u2665");
    });

    var reset = document.getElementById("reset-lines");
    if (reset) reset.addEventListener("click", resetJar);

    var share = document.getElementById("share-button");
    if (share) share.addEventListener("click", function () {
      var url = window.location.href;
      if (navigator.share) {
        navigator.share({ title: document.title, url: url }).catch(function () {});
        return;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () { note("Link copied \u2665"); })
          .catch(function () { note(url); });
        return;
      }
      note(url);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    load();
    render();
    wire();

    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("sw.js").catch(function () {});
      });
    }
  });
})();
