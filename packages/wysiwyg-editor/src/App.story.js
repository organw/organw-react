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

class Default extends React.Component {
  state = {
    value: serializer.deserialize('<p></p>'),
  };

  onChange = ({ value }) => {
    this.setState({ value });
  };

  onImageLoading = () => {
    return [
      {
        objid: "1",
        url: "https://www.pauliinasiniauer.com/wp-content/uploads/2015/02/IMG_6912-916x687.jpg",
      },
      {
        objid: "2",
        url: "https://d1bvpoagx8hqbg.cloudfront.net/originals/nice-places-visit-riga-71f95d3fb7704fc95ba62f07a5201b25.jpg",
      },
      {
        objid: "3",
        url: "https://www.ytravelblog.com/wp-content/uploads/2018/04/places-to-visit-in-slovakia-europe-1.jpg",
      }
    ];
  };

  onImageUpload = (file) => {
    return {
      content: "",
      docname: "",
      mime: "",
      length: "",
      alt: ""
    };
  };

  render() {
    return (
      <App value={this.state.value} onChange={this.onChange} onImageLoading={this.onImageLoading} onImageUpload={this.onImageUpload}>
        <Menubar>
          <MenuItem>File</MenuItem>
          <MenuItem>Help</MenuItem>
        </Menubar>
        <Toolbar>
          <ToolbarGroup>
            <ToolbarItem type="mark" tag="b" name="bold" id="bold">
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
            <ToolbarItem type="mark" tag="s" name="strikethrough">
              S
            </ToolbarItem>
            <ToolbarItem type="fontsize" tag="fontsize" name="fontsize">
              Betűméret&nbsp;
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
            <ToolbarItem type="align" tag="left" name="align-left">
              Align-left
            </ToolbarItem>
            <ToolbarItem type="align" tag="center" name="align-center">
              Align-center
            </ToolbarItem>
            <ToolbarItem type="align" tag="rignt" name="align-right">
              Align-right
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
            <ToolbarItem type="table" tag="table" name="table">
              Add table
            </ToolbarItem>
            <ToolbarItem type="table" tag="table" name="table_left">
              Add table left
            </ToolbarItem>
            <ToolbarItem type="table" tag="table" name="table_center">
              Add table center
            </ToolbarItem>
            <ToolbarItem type="table" tag="table" name="table_right">
              Add table right
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarItem type="link" tag="a" name="link">
              Add link
            </ToolbarItem>
            <ToolbarItem type="image" tag="img" name="image">
              Add image
            </ToolbarItem>
            <ToolbarItem type="image" tag="img" name="float_left">
              Add image with text inline left
            </ToolbarItem>
            <ToolbarItem type="image" tag="img" name="float_right">
              Add image with text inline right
            </ToolbarItem>
            <ToolbarItem type="embed" tag="embed" name="embed">
              Videó beágyazása
            </ToolbarItem>
            <ToolbarItem type="button" tag="button" name="button">
              Gomb beszúrása 
            </ToolbarItem>
            <ToolbarItem type="emoji" tag="emoji" name="emoji">
              Emoji beszúrása
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarItem type="text" tag="${JEGY_ÁR}" name="text" id="text">
              JEGY_ÁR
            </ToolbarItem>
           
          </ToolbarGroup>
        </Toolbar>
        <Editor />
        {/* {serializer.serialize(this.state.value)} */}
        <Statusbar />
      </App>
    );
  }
}

storiesOf('App', module).add('default', () => <Default />);
