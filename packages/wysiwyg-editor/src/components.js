import React from 'react';
import { cx, css } from 'emotion';
import { Editor, Change, Node } from 'slate';

export const Button = React.forwardRef(
  ({ className, active, reversed, ...props }, ref) => (
    <span
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          cursor: pointer;
          color: ${reversed
            ? active
              ? 'white'
              : '#aaa'
            : active
            ? 'black'
            : '#ccc'};
        `
      )}
    />
  )
);

export function TablePlugin() {
  return {
    schema: {
      blocks: {
        'table-cell': {
          data: {
            align: () => {
              return ['left', 'center', 'right'].includes(align);
            },
          },
          normalize() {
            if (error.code === 'node_data_invalid') {
              change.setNodeByKey(error.node.key, {
                data: error.node.data.set('align', 'left'),
              });
            }
          },
        },
      },
    },

    commands: {
      setColumnAlign() {
        const pos = editor.getPosition(editor.value);
        const columnCells = editor.getCellsAtColumn(
          pos.table,
          pos.getColumnIndex()
        );

        columnCells.forEach(cell => {
          const data = cell.data.toObject();
          editor.setNodeByKey(cell.key, { data: { ...data, align } });
        });
        return editor;
      },

      clearSelectedColumn() {
        const cells = editor.getCellsAtColumn(table, columnIndex);

        cells.forEach(cell => {
          if (!cell) return;

          const data = cell.data.toObject();
          editor.setNodeByKey(cell.key, {
            data: {
              ...data,
              selected: undefined,
            },
          });
        });
      },

      clearSelectedRow() {
        const cells = editor.getCellsAtRow(table, rowIndex);

        cells.forEach(cell => {
          if (!cell) return;

          const data = cell.data.toObject();
          editor.setNodeByKey(cell.key, {
            data: {
              ...data,
              selected: undefined,
            },
          });
        });
      },

      resetAlign() {
        const headCells = editor.getCellsAtRow(table, 0);

        // we need to re-query position as the table has been edited
        // since it was originally queried (pre-insert)
        const position = editor.getPositionByKey(
          editor.value.document,
          table.key
        );
        const cells = editor.getCellsAtRow(position.table, rowIndex);

        // take the alignment data from the head cells and map onto
        // the individual data cells
        cells.forEach((cell, index) => {
          const headCell = headCells.get(index);
          const data = headCell.data.toObject();
          editor.setNodeByKey(cell.key, {
            data: { ...data, selected: undefined },
          });
        });
      },

      clearSelected() {
        const previouslySelectedRows = table.data.get('selectedRows') || [];
        const previouslySelectedColumns =
          table.data.get('selectedColumns') || [];

        editor.withoutSaving(() => {
          previouslySelectedRows.forEach(rowIndex => {
            editor.clearSelectedRow(table, rowIndex);
          });

          previouslySelectedColumns.forEach(columnIndex => {
            editor.clearSelectedColumn(table, columnIndex);
          });

          if (
            previouslySelectedRows.length ||
            previouslySelectedColumns.length
          ) {
            editor.setNodeByKey(table.key, {
              data: {
                selectedTable: false,
                selectedColumns: [],
                selectedRows: [],
              },
            });
          }
        });

        return editor;
      },

      selectColumn() {
        const pos = editor.getPosition(editor.value);
        const selectedColumn = pos.getColumnIndex();

        editor.withoutSaving(() => {
          editor.clearSelected(pos.table);

          editor.setNodeByKey(pos.table.key, {
            data: {
              selectedColumns: selected ? [selectedColumn] : [],
              selectedRows: [],
            },
          });

          const cells = editor.getCellsAtColumn(pos.table, selectedColumn);

          cells.forEach(cell => {
            const data = cell.data.toObject();
            editor.setNodeByKey(cell.key, {
              data: {
                ...data,
                selected,
              },
            });
          });
        });

        return editor;
      },

      selectRow() {
        const pos = editor.getPosition(editor.value);
        const selectedRow = pos.getRowIndex();

        editor.withoutSaving(() => {
          editor.clearSelected(pos.table);

          editor.setNodeByKey(pos.table.key, {
            data: {
              selectedColumns: [],
              selectedRows: selected ? [selectedRow] : [],
            },
          });

          const cells = editor.getCellsAtRow(pos.table, selectedRow);

          cells.forEach(cell => {
            const data = cell.data.toObject();
            editor.setNodeByKey(cell.key, {
              data: {
                ...data,
                selected,
              },
            });
          });
        });

        return editor;
      },

      selectAll() {
        const pos = editor.getPosition(editor.value);

        editor.withoutSaving(() => {
          editor.withoutNormalizing(() => {
            const width = pos.getWidth();
            const height = pos.getHeight();
            const data = {
              selectedTable: true,
              selectedColumns: Array.from(Array(width).keys()),
              selectedRows: Array.from(Array(height).keys()),
            };

            editor.setNodeByKey(pos.table.key, { data });

            for (let y = 0; y < pos.getHeight(); y++) {
              const cells = editor.getCellsAtRow(pos.table, y);

              cells.forEach(cell => {
                const data = cell.data.toObject();
                editor.setNodeByKey(cell.key, {
                  data: {
                    ...data,
                    selected,
                  },
                });
              });
            }
          });
        });
      },
    },
  };
}

export const EditorValue = React.forwardRef(
  ({ className, value, ...props }, ref) => {
    const textLines = value.document.nodes
      .map(node => node.text)
      .toArray()
      .join('\n');
    return (
      <div
        ref={ref}
        {...props}
        className={cx(
          className,
          css`
            margin: 30px -20px 0;
          `
        )}
      >
        <div
          className={css`
            font-size: 14px;
            padding: 5px 20px;
            color: #404040;
            border-top: 2px solid #eeeeee;
            background: #f8f8f8;
          `}
        >
          Slate's value as text
        </div>
        <div
          className={css`
            color: #404040;
            font: 12px monospace;
            white-space: pre-wrap;
            padding: 10px 20px;
            div {
              margin: 0 0 0.5em;
            }
          `}
        >
          {textLines}
        </div>
      </div>
    );
  }
);
export const Icon = React.forwardRef(({ className, ...props }, ref) => (
  <span
    {...props}
    ref={ref}
    className={cx(
      'material-icons',
      className,
      css`
        font-size: 18px;
        vertical-align: text-bottom;
      `
    )}
  />
));
export const Instruction = React.forwardRef(({ className, ...props }, ref) => (
  <div
    {...props}
    ref={ref}
    className={cx(
      className,
      css`
        white-space: pre-wrap;
        margin: 0 -20px 10px;
        padding: 10px 20px;
        font-size: 14px;
        background: #f8f8e8;
      `
    )}
  />
));
export const Menu = React.forwardRef(({ className, ...props }, ref) => (
  <div
    {...props}
    ref={ref}
    className={cx(
      className,
      css`
        & > * {
          display: inline-block;
        }
        & > * + * {
          margin-left: 15px;
        }
      `
    )}
  />
));
export const Toolbar = React.forwardRef(({ className, ...props }, ref) => (
  <Menu
    {...props}
    ref={ref}
    className={cx(
      className,
      css`
        position: relative;
        padding: 1px 18px 17px;
        margin: 0 -20px;
        border-bottom: 2px solid #eee;
        margin-bottom: 20px;
      `
    )}
  />
));

export const hasMark = value =>
  value.blocks.some(node => node.type === 'alignment');
export const getMark = value =>
  value.blocks.filter(node => node.type === 'alignment').first();
export const getType = value => value.blocks.first().type;

export const alignmentMarkStrategy = (change, align) =>
  change
    .setBlocks({
      type: 'alignment',
      data: { align, currentBlockType: getType(change.value) },
    })
    .focus();

export const alignLeft = change => alignmentMarkStrategy(change, 'left');
export const alignCenter = change => alignmentMarkStrategy(change, 'center');
export const alignRight = change => alignmentMarkStrategy(change, 'right');
