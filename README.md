# hyper-copy-toast

Плагин для [Hyper](https://hyper.is): **копирует текст сразу при выделении** и показывает внизу терминала плашку **«Скопировано»** — как в Claude Code.

![demo](docs/demo.png)

## Установка

```sh
git clone https://github.com/hukopo/hyper-copy-toast ~/.hyper_plugins/local/hyper-copy-toast
cd ~/.hyper_plugins/local/hyper-copy-toast && npm i && npm run build
```

В `~/.hyper.js`:

```js
localPlugins: ['hyper-copy-toast'],
```

Затем **полностью перезапустите Hyper (Cmd+Q)** — новое окно или View → Reload новые плагины не подхватывают.

> Встроенную опцию `copyOnSelect` включать не нужно.

## Разработка

```sh
npm run build   # src/index.ts → dist/index.js
```

Исходник — `src/index.ts`: оборачивает компонент `Term`, подписывается на `onSelectionChange` у xterm, пишет выделение в буфер через `electron.clipboard` и на 1,2 с показывает плашку.

Проверено на Hyper 3.4.1, macOS.

## Лицензия

MIT
