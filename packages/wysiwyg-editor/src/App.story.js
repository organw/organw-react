import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { select, boolean } from '@storybook/addon-knobs';

import {
  App,
  Menubar,
  MenuItem,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  Editor,
  Statusbar,
} from './index';

class Default extends React.Component {
  state = {
    value: '<div>Teszt div</div>',
  };

  onChange = ({ value }) => {
    this.setState({ value: value });
  };

  render() {
    console.log(this.state.value);
    return (
      <App value={this.state.value} onChange={this.onChange}>
        <Menubar>
          <MenuItem>File</MenuItem>
          <MenuItem>Help</MenuItem>
        </Menubar>
        <Toolbar>
          <ToolbarGroup>
            <ToolbarItem type="mark" tag="b" name="bold">
              B
            </ToolbarItem>
            <ToolbarItem type="mark" tag="code" name="code">
              C
            </ToolbarItem>
            <ToolbarItem type="mark" tag="i" name="italic">
              I
            </ToolbarItem>
            <ToolbarItem type="mark" tag="u" name="underlined">
              U
            </ToolbarItem>
            <ToolbarItem type="block" tag="li" name="list-item">
              Lista
            </ToolbarItem>
            <ToolbarItem type="block" tag="ul" name="bulleted-list">
              Lista 2
            </ToolbarItem>
            <ToolbarItem type="block" tag="ol" name="numbered-list">
              Lista 3
            </ToolbarItem>
            <ToolbarItem type="block" tag="blockquote" name="block-quote">
              Quote
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarItem type="block" tag="h1" name="heading-one">
              H1
            </ToolbarItem>
            <ToolbarItem type="block" tag="h2" name="heading-two">
              H2
            </ToolbarItem>
            <ToolbarItem type="block" tag="h3" name="heading-three">
              H3
            </ToolbarItem>
            <ToolbarItem type="block" tag="h4" name="heading-four">
              H4
            </ToolbarItem>
            <ToolbarItem type="block" tag="h5" name="heading-five">
              H5
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarItem type="table" tag="table" name="table">
              Add table
            </ToolbarItem>
            <ToolbarItem type="table" tag="tr" name="table-row">
              Add row
            </ToolbarItem>
            <ToolbarItem type="table" tag="td" name="table-cell">
              Add cell
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarItem type="link" tag="a" name="link">
              Add link
            </ToolbarItem>
            <ToolbarItem type="image" tag="img" name="image">
              Add image
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarItem type="text" tag="${JEGY_ÁR}" name="text">
              JEGY_ÁR
            </ToolbarItem>
          </ToolbarGroup>
        </Toolbar>
        <Editor />
        <Statusbar />
      </App>
    );
  }
}

storiesOf('App', module).add('default', () => <Default />);
