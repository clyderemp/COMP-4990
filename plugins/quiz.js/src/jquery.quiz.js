;(function($, window, document, undefined) {

  'use strict';

  $.quiz = function(el, options) {
    var base = this;

    // Access to jQuery version of element
    base.$el = $(el);

    // Add a reverse reference to the DOM object
    base.$el.data('quiz', base);

    base.options = $.extend($.quiz.defaultOptions, options);

    var questions = base.options.questions,
      numQuestions = questions.length,
      startScreen = base.options.startScreen,
      startButton = base.options.startButton,
      homeButton = base.options.homeButton,
      resultsScreen = base.options.resultsScreen,
      gameOverScreen = base.options.gameOverScreen,
      nextButtonText = base.options.nextButtonText,
      finishButtonText = base.options.finishButtonText,
      restartButtonText = base.options.restartButtonText,
      currentQuestion = 1,
      score = 0,
      answerLocked = false;

    base.methods = {
      init: function() {
        base.methods.setup();

        $(document).on('click', startButton, function(e) {
          e.preventDefault();
          base.methods.start();
        });

        $(document).on('click', homeButton, function(e) {
          e.preventDefault();
          base.methods.home();
        });

        $(document).on('click', '.answers a', function(e) {
          e.preventDefault();
          base.methods.answerQuestion(this);
        });

        $(document).on('click', '#quiz-next-btn', function(e) {
          e.preventDefault();
          base.methods.nextQuestion();
        });

        $(document).on('click', '#quiz-finish-btn', function(e) {
          e.preventDefault();
          base.methods.finish();
        });

        $(document).on('click', '#quiz-restart-btn, #quiz-retry-btn', function(e) {
          e.preventDefault();
          base.methods.restart();
        });
      },
      setup: function() {
        var quizHtml = '';

        if (base.options.counter) {
          quizHtml += '<div id="quiz-counter"></div>';
        }

        quizHtml += '<div id="questions">';
        $.each(questions, function(i, question) {
          quizHtml += '<div class="question-container">';
          quizHtml += '<p id=question class="question">' + question.q + '</p>';
          quizHtml += '<ul class="answers">';
          $.each(question.options, function(index, answer) {
            quizHtml += '<li><a href="#" data-index="' + index + '">' + answer + '</a></li>';
          });
          quizHtml += '</ul>';
          quizHtml += '</div>';
        });
        quizHtml += '</div>';

        // if results screen not in DOM, add it
        if ($(resultsScreen).length === 0) {
          quizHtml += '<div id="' + resultsScreen.substr(1) + '">';
          quizHtml += '<p id="quiz-results"></p>';
          quizHtml += '</div>';
        }

        quizHtml += '<div id="quiz-controls">';
        quizHtml += '<p id="quiz-response"></p>';
        quizHtml += '<div id="quiz-buttons">';
        quizHtml += '<a href="#" id="quiz-next-btn">' + nextButtonText + '</a>';
        quizHtml += '<a href="#" id="quiz-finish-btn">' + finishButtonText + '</a>';
        quizHtml += '<a href="#" id="quiz-restart-btn">' + restartButtonText + '</a>';
        quizHtml += '</div>';
        quizHtml += '</div>';

        base.$el.append(quizHtml).addClass('quiz-container quiz-start-state');

        $('#quiz-counter').hide();
        $('.question-container').hide();
        $(gameOverScreen).hide();
        $(resultsScreen).hide();
        $('#quiz-controls').hide();
      },
      start: function() {
        base.$el.removeClass('quiz-start-state').addClass('quiz-questions-state');
        $(startScreen).hide();
        $('#quiz-controls').hide();
        $('#quiz-finish-btn').hide();
        $('#quiz-restart-btn').hide();
        $('#questions').show();
        $('#quiz-counter').show();
        $('.question-container:first-child').show().addClass('active-question');
        base.methods.updateCounter();

        //Start timer and end when done
        startTimer();
      },
      answerQuestion: function(answerEl) {
        if (answerLocked) {
          return;
        }
        answerLocked = true;

        var $answerEl = $(answerEl),
          response = '',
          selected = $answerEl.data('index'),
          currentQuestionIndex = currentQuestion - 1,
          correct = questions[currentQuestionIndex].correctIndex;

          var splitQuestion = questions[currentQuestionIndex].q.split(':');
          var getCategory = splitQuestion[0].split(' ');
          var str = getCategory[0].toLowerCase();

        if (selected === correct) {
          $answerEl.addClass('correct');
          response = questions[currentQuestionIndex].correctResponse;
          score++;
          

                    //str = str.replace(str.charAt(0), str.charAt(0).toUpperCase()); //convert to first char uppercase
          updateIntelScore(str);
        } else {
          $answerEl.addClass('incorrect');
          response = questions[currentQuestionIndex].incorrectResponse;
          if (!base.options.allowIncorrect) {
            base.methods.gameOver(response);
            return;
          }
        }

        addTotalAnswered(str);
        $('#quiz-next-btn').trigger('click');
        $('#quiz-response').html(response);
        $('#quiz-controls').fadeIn();

        if (typeof base.options.answerCallback === 'function') {
          base.options.answerCallback(currentQuestion, selected, questions[currentQuestionIndex]);
        }
      },
      nextQuestion: function() {
        answerLocked = false;

        $('.active-question')
          .hide()
          .removeClass('active-question')
          .next('.question-container')
          .show()
          .addClass('active-question');

        $('#quiz-controls').hide();

        // check to see if we are at the last question
        if (++currentQuestion === numQuestions) {
          $('#quiz-response').hide();
          $('#quiz-next-btn').hide();
        }

        if(currentQuestion > numQuestions){
          $('#quiz-finish-btn').trigger('click');
        }

        base.methods.updateCounter();

        if (typeof base.options.nextCallback === 'function') {
          base.options.nextCallback();
        }
      },
      gameOver: function(response) {
        // if gameover screen not in DOM, add it
        if ($(gameOverScreen).length === 0) {
          var quizHtml = '';
          quizHtml += '<div id="' + gameOverScreen.substr(1) + '">';
          quizHtml += '<p id="quiz-gameover-response"></p>';
          quizHtml += '<p><a href="#" id="quiz-retry-btn">' + restartButtonText + '</a></p>';
          quizHtml += '</div>';
          base.$el.append(quizHtml);
        }
        $('#quiz-gameover-response').html(response);
        $('#quiz-counter').hide();
        $('#questions').hide();
        $('#quiz-finish-btn').hide();
        $(gameOverScreen).show();
      },
      finish: function() {
        base.$el.removeClass('quiz-questions-state').addClass('quiz-results-state');
        $('.active-question').hide().removeClass('active-question');
        $('#quiz-counter').hide();
        $('#quiz-response').hide();
        $('#quiz-finish-btn').hide();
        $('#quiz-next-btn').hide();
        $('#quiz-restart-btn').hide();
        $(resultsScreen).show();

        step2Status='finished';
        $('#timer').text('');

        var step2ReportPath = firestoreDB.collection("myacadvisor-db").doc("myintel-db").collection(user.uid).doc('step2-Report');
        var percentStr = 'We collected the following data: <br>';
        var step2Report;
        var percentArray = [];
        var iqScores = [];
        var resultsStr = '';

        step2ReportPath.get().then(function(doc) {
          if(doc.exists){
             step2Report = doc.data().step2Results;
             

             for(var i =0; i<step2Report.length; i++){

                var split = step2Report[i].split(': ');
                var totalIntelQuestions = parseInt(returnTotal(split[0].toLowerCase()));
                var calculatePercent = (parseInt(split[1]) / totalIntelQuestions) * 100;
                if(calculatePercent>0){
                  percentArray.push(split[0] + ': ' + calculatePercent.toFixed(0)+' % <br>');
                  iqScores.push(calculatePercent.toFixed(0));
                }
                else{
                  percentArray.push(split[0] + ': 0 % - Insufficient Data! <br>');
                  iqScores.push(calculatePercent.toFixed(0));
                }
             }
                var docData = {
                  step2Scores: iqScores
              }
          
              step2ReportPath.update(docData).then(function() {
                  console.log("Step 2 Percentages Uploaded...");
              });

             for(var n=0; n<percentArray.length; n++){
                percentStr += percentArray[n];
             }

              if(score == 0){
                resultsStr += 'We have collected insufficient data to gather information about your IQ. Please retake the test again.<br>' + percentStr;
                resultsStr += '<br><button id=quiz-home-btn class="btn btn-primary">Retry</button>';
                $('#quiz-home-btn').show();
              }
              else{
                resultsStr += 'Thank you for taking this evaluation. You may retake this after 90 days.<br>';

                /**if(percentStr.length > 0){
                  resultsStr += base.options.resultsFormat.replace('%score', score).replace('%total', numQuestions) +'<br>' + percentStr;
                 }
                 else
                  resultsStr += base.options.resultsFormat.replace('%score', score).replace('%total', numQuestions) +'<br>';**/
              }

              $('#quiz-results').html(resultsStr);
          }
        });
        //var resultsStr = base.options.resultsFormat.replace('%score', score).replace('%total', numQuestions);
        //$('#quiz-results').html(resultsStr);

        if (typeof base.options.finishCallback === 'function') {
          base.options.finishCallback();
        }
      },
      restart: function() {
        base.methods.reset();
        base.$el.addClass('quiz-questions-state');
        $('#questions').show();
        $('#quiz-counter').show();
        $('.question-container:first-child').show().addClass('active-question');
        base.methods.updateCounter();
      },
      reset: function() {
        answerLocked = false;
        currentQuestion = 1;
        score = 0;
        $('.answers a').removeClass('correct incorrect');
        base.$el.removeClass().addClass('quiz-container');
        $('#quiz-restart-btn').hide();
        $(gameOverScreen).hide();
        $(resultsScreen).hide();
        $('#quiz-controls').hide();
        $('#quiz-response').show();
        $('#quiz-next-btn').show();
        $('#quiz-counter').hide();
        $('.active-question').hide().removeClass('active-question');
      },
      home: function() {
        document.getElementById("timer").innerHTML = 'Are you ready?';
        base.methods.reset();
        base.$el.addClass('quiz-start-state');
        $(startScreen).show();

        if (typeof base.options.homeCallback === 'function') {
          base.options.homeCallback();
        }
      },
      updateCounter: function() {
        var countStr = base.options.counterFormat.replace('%current', currentQuestion).replace('%total', numQuestions);
        $('#quiz-counter').html(countStr);
      }
    };

    base.methods.init();
  };

  $.quiz.defaultOptions = {
    allowIncorrect: true,
    counter: true,
    counterFormat: '%current/%total',
    startScreen: '#quiz-start-screen',
    startButton: '#quiz-start-btn',
    homeButton: '#quiz-home-btn',
    resultsScreen: '#quiz-results-screen',
    resultsFormat: 'You scored %score out of %total questions!<br>',
    gameOverScreen: '#quiz-gameover-screen',
    nextButtonText: 'Skip',
    finishButtonText: 'Submit and View Results',
    restartButtonText: 'Restart'
  };

  $.fn.quiz = function(options) {
    return this.each(function() {
      new $.quiz(this, options);
    });
  };

}(jQuery, window, document));