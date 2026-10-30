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
  class CopyToastTerm extends React.Component<Props, { shown: number }> {
    // счётчик вместо bool: новый key перезапускает анимацию при каждом копировании
    state = { shown: 0 };
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
        this.setState(({ shown }) => ({ shown: shown + 1 }));
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.setState({ shown: 0 }), 600);
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
        this.state.shown > 0 && React.createElement('style', null, blinkCss),
        this.state.shown > 0 &&
          React.createElement('div', { key: this.state.shown, className: 'copy-toast', style: toastStyle }, 'Copied')
      );
    }
  };

const toastStyle: ReactNS.CSSProperties = {
  position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
  padding: '4px 12px', borderRadius: 6, fontSize: 12, zIndex: 100,
  background: '#ff00ff', color: '#fff', fontWeight: 600, pointerEvents: 'none',
  animation: 'copy-toast-blink 600ms ease-out forwards',
};

const blinkCss = `@keyframes copy-toast-blink {
  0% { opacity: 0; } 15% { opacity: 1; } 30% { opacity: 0.4; } 45% { opacity: 1; } 75% { opacity: 1; } 100% { opacity: 0; }
}`;
