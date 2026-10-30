import type * as ReactNS from 'react';

declare const require: (id: string) => any;
const { clipboard } = require('electron');

// Hyper отдаёт свой Term-компонент; нужное нам — xterm-инстанс в поле `term`.
interface XTerm {
  getSelection(): string;
  onSelectionChange(cb: () => void): { dispose(): void };
}
interface HyperTerm { term?: XTerm }
interface Props { onDecorated?: (term: HyperTerm | null) => void; [key: string]: unknown }

export const decorateTerm = (Term: ReactNS.ComponentType<Props>, { React }: { React: typeof ReactNS }) =>
  class CopyToastTerm extends React.Component<Props, { shown: boolean }> {
    state = { shown: false };
    private timer?: ReturnType<typeof setTimeout>;
    private sub?: { dispose(): void };

    onDecorated = (term: HyperTerm | null) => {
      this.props.onDecorated?.(term);
      const xterm = term?.term;
      if (!xterm || this.sub) return;
      this.sub = xterm.onSelectionChange(() => {
        const text = xterm.getSelection();
        if (!text) return;
        clipboard.writeText(text);
        this.setState({ shown: true });
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.setState({ shown: false }), 1200);
      });
    };

    componentWillUnmount() {
      clearTimeout(this.timer);
      this.sub?.dispose();
    }

    render() {
      return React.createElement(
        'div',
        { style: { width: '100%', height: '100%', position: 'relative' } },
        React.createElement(Term, { ...this.props, onDecorated: this.onDecorated }),
        this.state.shown &&
          React.createElement('div', { className: 'copy-toast', style: toastStyle }, 'Скопировано')
      );
    }
  };

const toastStyle: ReactNS.CSSProperties = {
  position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
  padding: '4px 12px', borderRadius: 6, fontSize: 12, zIndex: 100,
  background: 'rgba(0,0,0,0.75)', color: '#fff', pointerEvents: 'none',
};
