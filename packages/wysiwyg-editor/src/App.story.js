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
    value: serializer.deserialize('<p align="left" style="font-size:17px"><strong>félkövér</strong></p><p align="left" style="font-size:17px"><code>blokk</code></p><p align="left" style="font-size:17px"><em>dőlt</em></p><p align="left" style="font-size:17px"><u>aláhúzott</u></p><p align="left" style="font-size:17px"><strike>áthúzott</strike></p><p align="left" style="font-size:17px"><q>idézet őűáőűáőűá</q></p><p align="left" style="font-size:30px"><strike><u><em><strong>teszt esztsadasdasd űűőáéűéőéá 30-as méret</strong></em></u></strike></p><p align="left" style="font-size:23px">betű méret 23</p><h1 style="text-align:left">H1 </h1><h2 style="text-align:left">H2</h2><h3 style="text-align:left">H3</h3><h4 style="text-align:left">H4</h4><h5 style="text-align:left">H5</h5><p align="left" style="font-size:17px">bal 17</p><p align="center" style="font-size:23px">közép 23</p><p align="right" style="font-size:29px">jobb 29</p><p align="left" style="font-size:17px"></p><li>lista1</li><li>lista1</li><ul><ul><li parent="bulleted-list">lista2</li><li parent="bulleted-list">lista2</li></ul></ul><ol><ol><li parent="numbered-list">lista3</li><li parent="numbered-list">lista3</li></ol></ol><p align="left" style="font-size:17px">Tábla1</p><table class="1" style="margin-left:0px;margin-right:auto;text-align:left"><tbody><tr><td>cell0-0</td><td>cell0-1</td></tr><tr><td>cell1-0</td><td>cell1-1</td></tr><tr><td>cell2-0</td><td>cell2-1</td></tr></tbody></table><p align="left" style="font-size:17px">Tábla2</p><table class="2" style="margin-left:0px;margin-right:auto;text-align:left"><tbody><tr><td>cell0-0</td><td>cell0-1</td><td>cell0-2</td></tr><tr><td>cell1-0</td><td>cell1-1</td><td>cell1-2</td></tr><tr><td>cell2-0</td><td>cell2-1</td><td>cell2-2</td></tr></tbody></table><p align="left" style="font-size:17px">Tábla3</p><table class="3" style="margin-left:auto;margin-right:auto;text-align:center;margin:0px auto;margin-bottom:0px;margin-top:0px"><tbody><tr><td>cell0-0</td><td>cell0-1</td><td>cell0-2</td></tr><tr><td>cell1-0</td><td>cell1-1</td><td>cell1-2</td></tr><tr><td>cell2-0</td><td>cell2-1</td><td>cell2-2</td></tr><tr><td>cell3-0</td><td>cell3-1</td><td>cell3-2</td></tr></tbody></table><p align="left" style="font-size:17px">Tábla4</p><table class="4" style="margin-left:auto;margin-right:0px;text-align:right;margin:0px auto;margin-bottom:0px;margin-top:0px"><tbody><tr><td>celasddsaadssaddsasadsadsadl0-0</td><td>cell0-1</td><td>cell0-2</td><td>cell0-3</td></tr><tr><td>cell1-0</td><td>cell1-1</td><td>cell1-2</td><td>cell1-3</td></tr><tr><td>cell2-0</td><td>cell2-1</td><td>cell2-2</td><td>cell2-3</td></tr><tr><td>cell3-0</td><td>cell3-1</td><td>cell3-2</td><td>cell3-3</td></tr></tbody></table><p align="left" style="font-size:17px"><a href="https://www.youtube.com/watch?v=EIolal0VsoE">Youtubelink</a></p><p align="left" style="font-size:17px"></p><img src="https://www.pauliinasiniauer.com/wp-content/uploads/2015/02/IMG_6912-916x687.jpg" style="display:block;margin-left:0px;margin-right:auto" class="css-1evewyj"/><p align="left" style="font-size:17px"></p><p align="left" style="font-size:17px">Kép szöveggel 1</p><p align="left" style="font-size:17px"></p><p align="left" style="font-size:17px;overflow-wrap:break-word;white-space:pre-wrap;word-wrap:break-word"><img align="left" src="https://d1bvpoagx8hqbg.cloudfront.net/originals/nice-places-visit-riga-71f95d3fb7704fc95ba62f07a5201b25.jpg" style="float:left;margin:0px 10px 10px 0px;margin-bottom:10px;margin-left:0px;margin-right:10px;margin-top:0px;width:400px"/>1</p><p align="left" style="font-size:17px;overflow-wrap:break-word;white-space:pre-wrap;word-wrap:break-word">2</p><p align="left" style="font-size:17px;overflow-wrap:break-word;white-space:pre-wrap;word-wrap:break-word">3</p><p align="left" style="font-size:17px;overflow-wrap:break-word;white-space:pre-wrap;word-wrap:break-word">4</p><p align="left" style="font-size:17px;overflow-wrap:break-word;white-space:pre-wrap;word-wrap:break-word">5</p><p align="left" style="font-size:17px;overflow-wrap:break-word;white-space:pre-wrap;word-wrap:break-word">6</p><p align="left" style="font-size:17px;overflow-wrap:break-word;white-space:pre-wrap;word-wrap:break-word">7</p><p align="left" style="font-size:17px;overflow-wrap:break-word;white-space:pre-wrap;word-wrap:break-word">8</p><p align="left" style="font-size:17px;overflow-wrap:break-word;white-space:pre-wrap;word-wrap:break-word">9</p><p align="left" style="font-size:17px;overflow-wrap:break-word;white-space:pre-wrap;word-wrap:break-word">Kép szöveggel 2</p><p align="left" style="font-size:17px"></p><p align="right" style="font-size:17px;overflow-wrap:break-word;white-space:pre-wrap;word-wrap:break-word"><img align="right" src="https://www.ytravelblog.com/wp-content/uploads/2018/04/places-to-visit-in-slovakia-europe-1.jpg" style="float:right;margin:0px 0px 10px 10px;margin-bottom:10px;margin-left:10px;margin-right:0px;margin-top:0px;width:400px"/>1</p><p align="right" style="font-size:17px;overflow-wrap:break-word;white-space:pre-wrap;word-wrap:break-word">2</p><p align="right" style="font-size:17px;overflow-wrap:break-word;white-space:pre-wrap;word-wrap:break-word">3</p><p align="right" style="font-size:17px;overflow-wrap:break-word;white-space:pre-wrap;word-wrap:break-word">4</p><p align="right" style="font-size:17px;overflow-wrap:break-word;white-space:pre-wrap;word-wrap:break-word">5</p><p align="right" style="font-size:17px;overflow-wrap:break-word;white-space:pre-wrap;word-wrap:break-word">6</p><p align="right" style="font-size:17px;overflow-wrap:break-word;white-space:pre-wrap;word-wrap:break-word">7</p><p align="right" style="font-size:17px;overflow-wrap:break-word;white-space:pre-wrap;word-wrap:break-word">8</p><p align="left" style="font-size:17px"></p><p align="left" style="font-size:17px;overflow-wrap:break-word;white-space:pre-wrap;word-wrap:break-word">Videó beágyazás:</p><p align="left" style="font-size:17px"></p><iframe src="https://www.youtube.com/embed/EIolal0VsoE" style="display:flex;height:400px;margin-left:0px;margin-right:auto;width:560px" class="css-er55u4" allow="accelerometer" allowfullscreen=""></iframe><p align="left" style="font-size:17px"></p><p align="left" style="font-size:17px;overflow-wrap:break-word;white-space:pre-wrap;word-wrap:break-word">CTA:</p><p align="left" style="font-size:17px;overflow-wrap:break-word;white-space:pre-wrap;word-wrap:break-word"><span>:kissing_heart:</span></p><button class="css-3t65p2" style="background-color:rgb(255, 0, 0);color:black;display:flex;margin-right:auto;text-align:left" href="https://www.youtube.com/watch?v=EIolal0VsoE">gombszöveg</button><p align="left" style="font-size:17px"></p>'),
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
          alert('apad');
          console.log(apad)
        }}>AAAAAA</button><br />
        {/* {serializer.serialize(this.state.value)} */}
        <Statusbar />
       
      </App>
     
    );
  }
}

storiesOf('App', module).add('default', () => <Default />);
