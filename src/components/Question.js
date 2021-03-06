import React from "react";
import { Modal, Button } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import he from "he";

import "../App.css";
import "../stylesheets/Question.css";
import { CSSTransition } from "react-transition-group";

class Question extends React.Component {
  constructor(props) {
    super(props);
    const { location, history } = this.props;
    if (!location.state) {
      console.log("asdfasdfasdf");
      history.push({
        pathname: "/",
      });
    }

    this.state = {
      showModal: false,
      answerBtnDisabled: false,
    };

    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleQuestionAnswer = this.handleQuestionAnswer.bind(this);
  }

  componentDidMount() {
    const { history } = this.props;
    const that = this;
    window.addEventListener("popstate", function (e) {
      history.go(1);
      that.showModal();
    });
  }

  componentWillUnmount() {}

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.location.state.questionMeta.id !==
      this.props.location.state.questionMeta.id
    ) {
      this.setState({
        answerBtnDisabled: false,
      });
    }
  }

  closeModal() {
    this.setState({
      showModal: false,
    });
  }

  showModal() {
    this.setState({
      showModal: true,
    });
  }

  // Button handler used when a user answers a question.
  handleQuestionAnswer(e) {
    e.preventDefault();
    this.setState({
      answerBtnDisabled: true,
    });

    const answer = e.target.value;
    const { questionMeta } = this.props.location.state;

    this.props.handleUserAnswer(answer, questionMeta.id);
  }

  render() {
    if (!this.props.location.state) {
      // State is not persisted after refresh. If this is the case,
      // then the user will be redirected to the home page in `constructor`.
      return <div></div>;
    }

    const fadeOutInTimeout = 1000;
    const { showModal, answerBtnDisabled } = this.state;

    const {
      questionMeta,
      totalNumQuestions,
      answers,
    } = this.props.location.state;

    return (
      <div className="main-content" id="quizContainer">
        <div id="quizProgress" className="fadeIn">
          <CSSTransition
            in={answerBtnDisabled}
            timeout={fadeOutInTimeout}
            classNames="fadeIn"
          >
            <span>
              Question {questionMeta.id}/{totalNumQuestions}
            </span>
          </CSSTransition>
        </div>
        <div id="quizMeta">
          <div id="quizQuestion">
            <CSSTransition
              in={answerBtnDisabled}
              timeout={fadeOutInTimeout}
              classNames="fadeIn"
            >
              <h1>{he.decode(questionMeta.question)}</h1>
            </CSSTransition>
          </div>
          <form id="quizAnswers" onSubmit={null}>
            {answers.map((answerMeta, index) => (
              <CSSTransition
                in={answerBtnDisabled}
                timeout={500}
                key={index}
                classNames="quizAnswerBtn"
              >
                <button
                  type={"button"}
                  name={`answer_${index}`}
                  value={answerMeta.answer}
                  className={"quizAnswerBtn"}
                  key={index}
                  onClick={this.handleQuestionAnswer}
                  disabled={answerBtnDisabled}
                >
                  <CSSTransition
                    in={answerBtnDisabled}
                    timeout={fadeOutInTimeout}
                    classNames="fadeIn"
                  >
                    <span>{he.decode(answerMeta.answer)}</span>
                  </CSSTransition>
                </button>
              </CSSTransition>
            ))}
          </form>
        </div>

        <Modal show={showModal} onHide={this.closeModal} size="md" centered>
          <Modal.Header closeButton>
            <Modal.Title>Reset Quiz</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Going back will reset the quiz. Would you like to continue?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeModal}>
              Close
            </Button>
            <Button variant="danger" onClick={this.props.resetQuiz}>
              Reset Quiz
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default withRouter(Question);
