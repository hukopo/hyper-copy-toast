"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorateTerm = void 0;
const { clipboard } = require('electron');
const decorateTerm = (Term, { React }) => class CopyToastTerm extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { shown: false };
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
                this.setState({ shown: true });
                clearTimeout(this.timer);
                this.timer = setTimeout(() => this.setState({ shown: false }), 1200);
            });
        };
    }
    componentWillUnmount() {
        var _a;
        clearTimeout(this.timer);
        (_a = this.sub) === null || _a === void 0 ? void 0 : _a.dispose();
    }
    render() {
        return React.createElement('div', { style: { width: '100%', height: '100%', position: 'relative' } }, React.createElement(Term, { ...this.props, onDecorated: this.onDecorated }), this.state.shown &&
            React.createElement('div', { className: 'copy-toast', style: toastStyle }, 'Скопировано'));
    }
};
exports.decorateTerm = decorateTerm;
const toastStyle = {
    position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
    padding: '4px 12px', borderRadius: 6, fontSize: 12, zIndex: 100,
    background: 'rgba(0,0,0,0.75)', color: '#fff', pointerEvents: 'none',
};
