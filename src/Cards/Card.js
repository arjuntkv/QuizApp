import React, { Component } from "react";
import "./Card.css";

class Card extends Component {
  state = {
    items: [],
    id: 0,
    correct_options: [],
    score: 0,
    disabled: false,
    correct: "",
    restart: false,
  };

  componentDidMount() {
    this.fetchItems();
  }

  fetchItems = () => {
    fetch(
      "https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple"
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data.results);
        this.setState({ items: data.results }, () => this.optionsRandoming());
      });
  };

  //Randoming options ie connecting both incoorect and right options
  optionsRandoming = () => {
    if (this.state.items.length > 0) {
      var incorrect_options = this.state.items[this.state.id].incorrect_answers;
      var correct_option = this.state.items[this.state.id].correct_answer;
      incorrect_options.splice(
        Math.floor(Math.random() * 4),
        0,
        correct_option
      );
      this.setState({ correct_options: incorrect_options });
    }
  };

  //to go to next quiz
  increaseCount = () => {
    if (this.state.id === 9) {
      this.setState({ restart: true });
    }
    this.setState({ correct: "" });
    this.setState({ disabled: false });

    if (this.state.id < 9) {
      this.setState({ id: this.state.id + 1 }, () => {
        this.optionsRandoming();
      });
    }
  };

  //btn click
  handleClick = (optionid) => {
    if (this.state.disabled === false) {
      if (
        this.state.correct_options[optionid] ===
        this.state.items[this.state.id].correct_answer
      ) {
        //correct answer
        this.setState({ correct: "true" });
        this.setState({ score: this.state.score + 1 });
      } else {
        //wrong answer
        this.setState({ correct: "false" });
      }
    }

    //to disable the button after selecting option and callback to restart the quiz at the end
    this.setState({ disabled: true }, () => {
      if (this.state.id === 9 && this.state.disabled === true) {
        this.setState({ restart: true });
      }
    });
  };

  //restart quiz
  restartQuiz = () => {
    this.setState({
      items: [],
      id: 0,
      correct_options: [],
      score: 0,
      disabled: false,
      correct: "",
      restart: false,
    });
    this.fetchItems();
  };
  render() {
    return (
      <div className="cardMain">
        {/* ============================== */}
        <div className="alert">
          {this.state.correct === "true" ? (
            <div className="green">Correct Answer</div>
          ) : (
            ""
          )}

          {this.state.correct === "false" ? (
            <div className="red">Wrong Answer</div>
          ) : (
            ""
          )}
        </div>

        {/* =========================== */}
        <div className="score">Score: {this.state.score}</div>
        <div className="noofqns">Questions: {this.state.id + 1} / 10</div>

        {/* ============================== */}
        {this.state.items.length > 0 ? (
          <div className="card">
            {/* to bypass &#039 */}
            <div
              dangerouslySetInnerHTML={{
                __html: this.state.items[this.state.id].question,
              }}
            ></div>
            <button className="btn" onClick={() => this.handleClick(0)}>
              {this.state.correct_options[0]}
            </button>
            <button className="btn" onClick={() => this.handleClick(1)}>
              {this.state.correct_options[1]}
            </button>
            <button className="btn" onClick={() => this.handleClick(2)}>
              {this.state.correct_options[2]}
            </button>
            <button className="btn" onClick={() => this.handleClick(3)}>
              {this.state.correct_options[3]}
            </button>
          </div>
        ) : (
          "loading...."
        )}

        {/* ============================== */}

        {this.state.items.length > 0 && this.state.restart === false ? (
          <button className="next" onClick={this.increaseCount}>
            Next Quiz
          </button>
        ) : (
          ""
        )}

        {/* ============================== */}

        {(this.state.items.length > 0 && this.state.restart === true) ||
        this.state.id >= 10 ? (
          <button onClick={this.restartQuiz} className="restart">
            Restart Quiz
          </button>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default Card;
