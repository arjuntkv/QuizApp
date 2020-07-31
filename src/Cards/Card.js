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
    category: 11,
  };

  componentDidMount() {
    this.fetchItems();
  }

  fetchItems = () => {
    fetch(
      `https://opentdb.com/api.php?amount=10&category=${this.state.category}&difficulty=easy&type=multiple`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data.results);
        this.setState({ items: data.results }, () => this.optionsRandoming());
      });
  };

  //to handle Category Change
  handleCategoryChange = (e) => {
    this.setState(
      {
        category: e.target.value,
        items: [],
        id: 0,
        correct_options: [],
        score: 0,
        disabled: false,
        correct: "",
        restart: false,
      },
      () => {
        this.fetchItems();
      }
    );
    console.log(e.target.value);
  };

  //Randoming options ie connecting both incorrect and right options
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
      <div>
        {/* Navbar Part ==>*/}
        <div className="navbar">
          {/* ================================= */}
          {/* if it contains "Entertainment: films" then return split(":")[1] else return category */}
          <p className="heading">
            {this.state.items.length > 0
              ? this.state.items[0].category.split(":")[1] === undefined
                ? this.state.items[0].category + " "
                : this.state.items[0].category.split(":")[1] + " "
              : ""}
            Quiz
          </p>
          {/* ================================== */}
          <div className="category-main">
            <select
              value={this.state.category}
              onChange={this.handleCategoryChange}
            >
              <option className="opt" value={11}>
                Films
              </option>
              <option value={14}>Tv</option>
              <option value={26}>Celebrities</option>
              <option value={18}>Computers</option>
              <option value={27}>Animals</option>
              <option value={21}>Sports </option>
              <option value={15}>Video Games</option>
              <option value={28}>Vehicles</option>
              <option value={23}>History</option>
              <option value={0}>Random</option>
            </select>
          </div>
        </div>

        {/* Main Part ==> */}
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
              {/* btn1 */}
              <button
                className="btn"
                onClick={() => this.handleClick(0)}
                dangerouslySetInnerHTML={{
                  __html: this.state.correct_options[0],
                }}
              ></button>
              {/* btn2 */}
              <button
                className="btn"
                onClick={() => this.handleClick(1)}
                dangerouslySetInnerHTML={{
                  __html: this.state.correct_options[1],
                }}
              ></button>
              {/* btn3 */}
              <button
                className="btn"
                onClick={() => this.handleClick(2)}
                dangerouslySetInnerHTML={{
                  __html: this.state.correct_options[2],
                }}
              ></button>
              {/* btn4 */}
              <button
                className="btn"
                onClick={() => this.handleClick(3)}
                dangerouslySetInnerHTML={{
                  __html: this.state.correct_options[3],
                }}
              ></button>
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
      </div>
    );
  }
}

export default Card;
