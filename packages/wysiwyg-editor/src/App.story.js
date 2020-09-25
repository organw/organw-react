import React from 'react';
import { storiesOf } from '@storybook/react';
import { serializer, SharedAppConsumer } from './App';
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
import { SetSelectionOperation } from 'slate';

class Default extends React.Component {
  state = {
    value: serializer.deserialize('<p align="left" style="font-size:17px"></p>'),
    fontsize: '',
    color: '#bbb'
  };

  onChange = ({ value }) => {
    this.setState({ value });
  };
  
  render() {
    return (
      <App value={this.state.value} onChange={this.onChange}>
        <Menubar>
          <MenuItem>File</MenuItem>
          <MenuItem>Help</MenuItem>
        </Menubar>
        <Toolbar className="position-sticky">
          <ToolbarGroup>
            
            <ToolbarItem type="mark" tag="b" name="bold" tooltip="Félkövér">
              <i className="fa fa-bold" aria-hidden="true"></i>
            </ToolbarItem>
            <ToolbarItem type="mark" tag="code" name="code" tooltip="Kód">
              <i className="fa fa-code" aria-hidden="true"></i>
            </ToolbarItem>
            <ToolbarItem type="mark" tag="i" name="italic" tooltip="Dőlt">
              <i className="fa fa-italic" aria-hidden="true"></i>
            </ToolbarItem>
            <ToolbarItem type="mark" tag="u" name="underline" tooltip="Aláhúzott">
              <i className="fa fa-underline" aria-hidden="true"></i>
            </ToolbarItem>
            <ToolbarItem type="mark" tag="s" name="strikethrough" tooltip="Áthúzott">
              <i className="fa fa-strikethrough" aria-hidden="true"></i>
            </ToolbarItem>
            <ToolbarItem type="block" tag="quote" name="quote" tooltip="Idézet">
              <i className="fa fa-quote-right" aria-hidden="true"></i>
            </ToolbarItem>
            <ToolbarItem type="fontsize" tag="fontsize" name="fontsize" tooltip="Betűméret">
              Betűméret&nbsp;
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarItem type="block" tag="h1" name="heading-one" tooltip="Címsor 1">
              H1
            </ToolbarItem>
            <ToolbarItem type="block" tag="h2" name="heading-two" tooltip="Címsor 2">
              H2
            </ToolbarItem>
            <ToolbarItem type="block" tag="h3" name="heading-three" tooltip="Címsor 3">
              H3
            </ToolbarItem>
            <ToolbarItem type="block" tag="h4" name="heading-four" tooltip="Címsor 4">
              H4
            </ToolbarItem>
            <ToolbarItem type="block" tag="h5" name="heading-five" tooltip="Címsor 5">
              H5
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarItem type="align" tag="left" name="align-left"  tooltip="Balra igazítás">
              <i className="fa fa-align-left" aria-hidden="true"></i>
            </ToolbarItem>
            <ToolbarItem type="align" tag="center" name="align-center" tooltip="Középre igazítás">
              <i className="fa fa-align-center" aria-hidden="true"></i>
            </ToolbarItem>
            <ToolbarItem type="align" tag="rignt" name="align-right" tooltip="Jobbra igazítás">
              <i className="fa fa-align-right" aria-hidden="true"></i>
            </ToolbarItem>
            <ToolbarItem type="block" tag="li" name="list-item" tooltip="Sima lista">
              <i className="fa fa-list" aria-hidden="true"></i>
            </ToolbarItem>
            <ToolbarItem type="block" tag="ul" name="bulleted-list" tooltip="Pontozott lista">
              <i className="fa fa-list-ul" aria-hidden="true"></i>
            </ToolbarItem>
            <ToolbarItem type="block" tag="ol" name="numbered-list" tooltip="Számozott lista">
              <i className="fa fa-list-ol" aria-hidden="true"></i>
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarItem type="table" tag="table" name="table" tooltip="Táblázat">
              <i className="fa fa-table" aria-hidden="true"></i>
            </ToolbarItem>
            <ToolbarItem type="table" tag="table" name="table_left" tooltip="Balra igazított táblázat">
              <i className="fa fa-table" aria-hidden="true" style={{ marginRight: 5 }}></i>
              {' '}
              <i className="fa fa-align-left" aria-hidden="true"></i>
            </ToolbarItem>
            <ToolbarItem type="table" tag="table" name="table_center" tooltip="Középre igazított táblázat">
              <i className="fa fa-table" aria-hidden="true" style={{ marginRight: 5 }}></i>
              {' '}
              <i className="fa fa-align-center" aria-hidden="true"></i>
            </ToolbarItem>
            <ToolbarItem type="table" tag="table" name="table_right" tooltip="Jobbra igazított táblázat">
              <i className="fa fa-table" aria-hidden="true" style={{ marginRight: 5 }}></i>
              {' '}
              <i className="fa fa-align-right" aria-hidden="true"></i>
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarItem type="link" tag="a" name="link" tooltip="Link">
              <i className="fa fa-link" aria-hidden="true"></i>
            </ToolbarItem>
            <ToolbarItem type="image" tag="img" name="image" tooltip="Kép">
              <i className="fa fa-picture-o" aria-hidden="true"></i>
            </ToolbarItem>
            <ToolbarItem type="image" tag="img" name="float_left" tooltip="Kép szöveggel balra">
              <i className="fa fa-indent" aria-hidden="true"></i>
            </ToolbarItem>
            <ToolbarItem type="image" tag="img" name="float_right" tooltip="Kép szöveggel jobbra">
              <i className="fa fa-outdent" aria-hidden="true"></i>
            </ToolbarItem>
            <ToolbarItem type="embed" tag="embed" name="embed" tooltip="Videó">
            < i className="fa fa-video-camera" aria-hidden="true"></i>
            </ToolbarItem>
            <ToolbarItem type="button" tag="button" name="button" tooltip="CTA gomb">
              CTA gomb
            </ToolbarItem>
            <ToolbarItem type="emoji" tag="emoji" name="emoji" tooltip="Emoji">
              <i className="fa fa-smile-o" aria-hidden="true"></i>
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarItem type="text" tag="${JEGY_ÁR}" name="text" id="text">
              JEGY_ÁR
            </ToolbarItem>
           
          </ToolbarGroup>
        </Toolbar>
        <Editor />
        <button onClick={() => {
          let vaa = serializer.serialize(this.state.value);
          let anyad = serializer.deserialize(vaa);
          let apad = serializer.serialize(anyad);
          alert(anyad);
          console.log(apad)
        }}>AAAAAA</button><br />
        {/* {serializer.serialize(this.state.value)} */}
        <Statusbar />
       
      </App>
     
    );
  }
}

storiesOf('App', module).add('default', () => <Default />);
