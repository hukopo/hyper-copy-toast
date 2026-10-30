"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorateTerm = void 0;
const { clipboard } = require('electron');
const decorateTerm = (Term, { React }) => class CopyToastTerm extends React.Component {
    constructor() {
        super(...arguments);
        // счётчик вместо bool: новый key перезапускает анимацию при каждом копировании
        this.state = { shown: 0 };
        this.onDecorated = (term) => {
            var _a, _b;
            (_b = (_a = this.props).onDecorated) === null || _b === void 0 ? void 0 : _b.call(_a, term);
            const xterm = term === null || term === void 0 ? void 0 : term.term;
            if (!xterm || this.sub)
                return;
            this.sub = xterm.onSelectionChange(() => {
                const text = xterm.getSelection();
                if (!text)
                    return;
                clipboard.writeText(text);
                this.setState(({ shown }) => ({ shown: shown + 1 }));
                clearTimeout(this.timer);
                this.timer = setTimeout(() => this.setState({ shown: 0 }), 600);
            });
        };
    }
    componentWillUnmount() {
        var _a;
        clearTimeout(this.timer);
        (_a = this.sub) === null || _a === void 0 ? void 0 : _a.dispose();
    }
    render() {
        return React.createElement('div', { style: { width: '100%', height: '100%', position: 'relative' } }, React.createElement(Term, { ...this.props, onDecorated: this.onDecorated }), this.state.shown > 0 && React.createElement('style', null, blinkCss), this.state.shown > 0 &&
            React.createElement('div', { key: this.state.shown, className: 'copy-toast', style: toastStyle }, 'Copied'));
    }
};
exports.decorateTerm = decorateTerm;
const toastStyle = {
    position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
    padding: '4px 12px', borderRadius: 6, fontSize: 12, zIndex: 100,
    background: '#ff00ff', color: '#fff', fontWeight: 600, pointerEvents: 'none',
    animation: 'copy-toast-blink 600ms ease-out forwards',
};
const blinkCss = `@keyframes copy-toast-blink {
  0% { opacity: 0; } 15% { opacity: 1; } 30% { opacity: 0.4; } 45% { opacity: 1; } 75% { opacity: 1; } 100% { opacity: 0; }
}`;
