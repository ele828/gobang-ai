/** @jsx React.DOM */

var React = require('react');

var AI = require('./ai');

var EMPTY = 0;
var BLACK = 1;
var WHITE = 2;
var SQUARE = 30;

var Grid = React.createClass({
  render: function() {
    var rows = this.props.rows-1;
    var cols = this.props.cols-1;
    var boxNodes = [];

    for(var i = 0; i < rows; i++)
      for(var j = 0; j < cols; j++) {
        var styles = {
          width: SQUARE,
          height: SQUARE,
          top: i * SQUARE,
          left: j * SQUARE
        };
        boxNodes.push(<div className="box" style={styles}/>);
      }

    var gridStyles = {
      top: SQUARE / 2,
      left: SQUARE /2,
      width: SQUARE * cols,
      height: SQUARE * rows
    };

    return <div className="m-grid" style={gridStyles}>{boxNodes}</div>;
  }
})

var Box = React.createClass({
  render: function() {
    var x = this.props.x;
    var y = this.props.y;
    var rows = this.props.rows;
    var cols = this.props.cols;
    var val = this.props.val;

    var styles = {
      width: SQUARE,
      height: SQUARE,
      top: y * SQUARE,
      left: x * SQUARE
    };

    var inner = (val === WHITE ? 'white' : (val === BLACK ? 'black' : ''));
    return this.transferPropsTo(
      <div className='box' style={styles}>
        <div className={inner}/>
      </div>
    );
  },
});

var Gobang = React.createClass({
  componentDidMount: function() {
      this.AI = AI;
      this.AI.init(this.state.map, this.props.rows, this.props.cols, this.dropChess)
  },

  getInitialState: function() {
    var rows = this.props.rows;
    var cols = this.props.cols;
    var map = [];

    for(var i = 0; i < rows; i++) {
      map[i] = new Array(cols);
      for(var j = 0; j < cols; j++) {
        map[i][j] = EMPTY;
      }
    }

    return {
      turn: BLACK,
      result: EMPTY,
      map: map
    };
  },

  undo: function() {
    if(typeof this.lastX === 'number' &&
       typeof this.lastY === 'number') {

      var map = this.state.map;
      map[this.lastY][this.lastX] = EMPTY;

      var state = {
        turn: this.lastTurn,
        result: EMPTY,
        map: map
      };

      this.setState(state);
    }
  },

  reset: function() {
    var rows = this.props.rows;
    var cols = this.props.cols;
    var map = this.state.map;

    for(var i = 0; i < rows; i++)
      for(var j = 0; j < cols; j++)
        map[i][j] = EMPTY;

    var state = {
      turn: BLACK,
      result: EMPTY,
      map: map
    };

  },

  render: function() {
    var rows = this.props.rows;
    var cols = this.props.cols;
    var map = this.state.map;
    var result = this.state.result;
    var boxNodes = [];
    var resultText = ['', 'black win', 'white win'][result];

    for(var i = 0; i < rows; i++)
      for(var j = 0; j < cols; j++)
        boxNodes.push(
          <Box onClick={this._onClick.bind(this, j, i)} x={j} y={i} rows={rows} cols={cols} val={map[i][j]}/>
        );

    return (
      <div>
        <div className="m-gobang">
          <div className="m-boxes">{boxNodes}</div>
          <Grid rows={rows} cols={cols}/>
        </div>

      </div>
    );
  },

  _dropChess: function(x, y, computer) {
      var rows = this.props.rows;
      var cols = this.props.cols;
      var map = this.state.map;
      var turn = this.state.turn;
      // var turn;

      // if (computer) {
      //   turn = WHITE;
      // } else {
      //   turn = BLACK;
      // }

      if(!map[y][x]) {
        map[y][x] = turn;

        var state = {
          map: map,
          turn: turn === WHITE ? BLACK : WHITE,
          result: checkResult(map, rows, cols, x, y)
        };

        this.setState(state);

        this.lastY = y;
        this.lastX = x;
        this.lastTurn = turn;
        return true;
      }
      // Not success
      return false;
  },

  dropChess: function(i, j) {
    return this._dropChess(j, i);
  },

  _onClick: function(x, y) {
    // Computer AI
    this.AI.drop(y, x, false);
  }

});

Array.prototype.areAll = function(val) {
  if(this.length === 0) return false;
  for(var i = 0, l = this.length; i < l; i++)
    if(this[i] !== val) return false;
  return true;
};

function checkResult(map, rows, cols, x, y) {
  var cur = map[y][x];

  var s1 = Math.max(y-5, 0);
  var s2 = Math.min(y, rows-5);

  for(var i = s1; i <= s2; i++) {
    var a = [map[i][x], map[i+1][x], map[i+2][x],
      map[i+3][x], map[i+4][x]];
    if(a.areAll(cur)) return cur;
  }

  s1 = Math.max(x-5, 0);
  s2 = Math.min(x, cols-5);

  for(var i = s1; i <= s2; i++) {
    var a = [map[y][i], map[y][i+1], map[y][i+2],
      map[y][i+3], map[y][i+4]];
    if(a.areAll(cur)) return cur;
  }

  for(var i = 0; i < rows; i++) {
    if(y-i > 0 && y-i+4 < rows && x-i > 0 && x-i+4 < cols) {
      var a = [map[y-i][x-i], map[y-i+1][x-i+1], map[y-i+2][x-i+2],
        map[y-i+3][x-i+3], map[y-i+4][x-i+4]];
      if(a.areAll(cur)) return cur;
    }
  }

  for(var i = 0; i < rows; i++) {
    if(y-i > 0 && y-i+4 < rows && x+i < cols && x+i-4 > 0) {
      var a = [map[y-i][x+i], map[y-i+1][x+i-1], map[y-i+2][x+i-2],
        map[y-i+3][x+i-3], map[y-i+4][x+i-4]];
      if(a.areAll(cur)) return cur;
    }
  }

  return EMPTY;
}

React.renderComponent(<Gobang rows={15} cols={15}/>, document.body);

window.React = React;
module.exports = Gobang;
