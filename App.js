import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar, 
  Image, 
  SafeAreaView, 
  TouchableOpacity, 
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import Video from 'react-native-video';
import videoSRC from './assets/videos/video_031318.mp4'
import Orientation from 'react-native-orientation';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/Ionicons';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const mockAPI = [
  {
    activityId: 1,
    activityType: 'trueFalse',
    interactive: true,
    activityStart: 12,//time to start interactive segment within overall video, in seconds
    interactiveScreenStart: 12,//time to display interactive screen
    interactiveTargetImageStart: 12,//time to display activity target image or images
    interactiveButtonStart: 12,//time to display interactive buttons, non-clickable, could also be microphone
    greenButtonHighlightStart: 15, //time to display green button highlight
    redButtonHighlightStart: 16,//time to display red button highlight
    interactivityStart: 17,//time to allow user interactivity, start countdown clock 
    countdownClockStart: 17,//time to display clock countdown, should be same as interactivityStart
    interactivityDuration: 3,//total time for user interactivity, can use instead of countdown duration
    highlightCorrectAnswerStart: 23,//time to highlight correct answer
    highlightCorrectAnswerDuration: 2,//duration to highlight correct answer
    activityEnd: 25,//time to end all activity screens
    activityImages: require('./assets/images/word_play/eyes.png'), //image assets, target images, interactive icons, etc.
    correctAnswer: 'green' //correct answer to the activity question//
  },
  {
    activityId: 2,
    activityType: 'trueFalse',
    interactive: true,
    activityStart: 26, 
    interactiveScreenStart: 26, 
    interactiveTargetImageStart: 26, 
    interactiveButtonStart: 26, 
    greenButtonHighlightStart: 28, 
    redButtonHighlightStart: 29, 
    interactivityStart: 29, 
    countdownClockStart: 29, 
    interactivityDuration: 3,
    highlightCorrectAnswerStart: 35,
    highlightCorrectAnswerDuration: 1,
    activityEnd: 36,
    activityImages: require('./assets/images/word_play/fingers.png'),
    correctAnswer: 'red'
  },
  {
    activityId: 3,
    activityType: 'speechActivity',
    interactive: true,
    activityStart: 47, 
    interactiveScreenStart: 47, 
    interactiveTargetImageStart: 47, 
    interactiveButtonStart: 47, 
    interactivityStart: 50, 
    countdownClockStart: 50, 
    interactivityDuration: 3, 
    interactivityAnimationDuration: 3,
    highlightCorrectAnswerStart: 56,
    highlightCorrectAnswerDuration: 1,
    activityEnd: 57,
    activityImages: require('./assets/images/word_play/nose.png'),
    correctAnswer: 'nose',
    pcmFileName: 'nose'
  },
  {
    activityId: 4,
    activityType: 'speechActivity',
    interactive: true,
    activityStart: 57,
    interactiveScreenStart: 57,
    interactiveTargetImageStart: 57,
    interactiveButtonStart: 57,
    interactivityStart: 60,
    countdownClockStart: 60,
    interactivityDuration: 3,
    interactivityAnimationDuration: 3,
    highlightCorrectAnswerStart: 65,
    highlightCorrectAnswerDuration: 1,
    activityEnd: 66,
    activityImages: require('./assets/images/word_play/ear.png'),
    correctAnswer: 'ears',
    pcmFileName: 'ears'
  },
  {
    activityId: 5,
    activityType: 'speechActivity',
    interactive: true,
    activityStart: 67,
    interactiveScreenStart: 67,
    interactiveTargetImageStart: 67,
    interactiveButtonStart: 67,
    interactivityStart: 69,
    countdownClockStart: 69,
    interactivityDuration: 3,
    interactivityAnimationDuration: 3,
    highlightCorrectAnswerStart: 75,
    highlightCorrectAnswerDuration: 1,
    activityEnd: 76, 
    activityImages: require('./assets/images/word_play/finger.png'),
    correctAnswer: 'fingers',
    pcmFileName: 'fingers'
  },
  {
    activityId: 6,
    activityType: 'multipleChoice',
    interactive: true,
    activityStart: 84, 
    interactiveScreenStart: 84, 
    interactiveTargetImageStart: 84, 
    interactivityStart: 85,
    countdownClockStart: 85,
    interactivityDuration: 3,
    highlightCorrectAnswerStart: 91, 
    highlightCorrectAnswerDuration: 1,
    activityEnd: 92,
    activityOptions: [
      {id: 1, image: require('./assets/images/word_play/foot.png')},
      {id: 2, image: require('./assets/images/word_play/ear.png')},
      {id: 3, image: require('./assets/images/word_play/finger.png')},
      {id: 4, image: require('./assets/images/word_play/head.png')}
    ],
    correctAnswer: 1,
  },
  {
    activityId: 7,
    activityType: 'multipleChoice',
    interactive: true,
    activityStart: 93, 
    interactiveScreenStart: 93, 
    interactiveTargetImageStart: 93, 
    interactivityStart: 94,
    countdownClockStart: 94,
    interactivityDuration: 3,
    highlightCorrectAnswerStart: 100, 
    highlightCorrectAnswerDuration: 2,
    activityEnd: 102,
    activityOptions: [
      {id: 1, image: require('./assets/images/word_play/body.png')},
      {id: 2, image: require('./assets/images/word_play/finger.png')},
      {id: 3, image: require('./assets/images/word_play/feet.png')},
      {id: 4, image: require('./assets/images/word_play/hand.png')}
    ],
    correctAnswer: 3,
  },
  {
    activityId: 8,
    activityType: 'multipleChoice',
    interactive: true,
    activityStart: 103, 
    interactiveScreenStart: 103, 
    interactiveTargetImageStart: 103, 
    interactivityStart: 104,
    countdownClockStart: 104,
    interactivityDuration: 3,
    highlightCorrectAnswerStart: 110, 
    highlightCorrectAnswerDuration: 1,
    activityEnd: 111,
    activityOptions: [
      {id: 1, image: require('./assets/images/word_play/ear.png')},
      {id: 2, image: require('./assets/images/word_play/foot.png')},
      {id: 3, image: require('./assets/images/word_play/head.png')},
      {id: 4, image: require('./assets/images/word_play/knee.png')}
    ],
    correctAnswer: 4,
  },
  {
    activityId: 9,
    activityType: 'speechActivity',
    interactive: true,
    activityStart: 118, 
    interactiveScreenStart: 118, 
    interactiveTargetImageStart: 118, 
    interactiveButtonStart: 118, 
    interactivityStart: 120, 
    countdownClockStart: 120, 
    interactivityDuration: 3, 
    interactivityAnimationDuration: 3, 
    highlightCorrectAnswerStart: 130,
    highlightCorrectAnswerDuration: 1,
    activityEnd: 131,
    activityImages: require('./assets/images/word_play/body.png'),
    correctAnswer: 'body',
    pcmFileName: 'body'
  },
  {
    activityId: 10,
    activityType: 'speechActivity',
    interactive: true,
    activityStart: 131, 
    interactiveScreenStart: 131, 
    interactiveTargetImageStart: 131, 
    interactiveButtonStart: 131, 
    interactivityStart: 133, 
    countdownClockStart: 133, 
    interactivityDuration: 3, 
    interactivityAnimationDuration: 3, 
    highlightCorrectAnswerStart: 141,
    highlightCorrectAnswerDuration: 1,
    activityEnd: 142,
    activityImages: require('./assets/images/word_play/mouth.png'),
    correctAnswer: 'mouth',
    pcmFileName: 'mouth'
  },
  {
    activityId: 11,
    activityType: 'speechActivity',
    interactive: true,
    activityStart: 143, 
    interactiveScreenStart: 143, 
    interactiveTargetImageStart: 143, 
    interactiveButtonStart: 143, 
    interactivityStart: 145, 
    countdownClockStart: 145, 
    interactivityDuration: 3, 
    interactivityAnimationDuration: 3, 
    highlightCorrectAnswerStart: 154,
    highlightCorrectAnswerDuration: 1,
    activityEnd: 155,
    activityImages: require('./assets/images/word_play/toe.png'),
    correctAnswer: 'toe',
    pcmFileName: 'toe'
  },
  {
    activityId: 12,
    activityType: 'resultsScreen',
    interactive: false,
    resultsScreenStart: 156,
    resultsScreenDuration: 9,
    resultsScreenEnd: 164,
    resultsScreenOptions: [
      {id: 1, isSpeechActivity: false, answerCorrect: null, image:require('./assets/images/word_play/eyes.png')},
      {id: 3, isSpeechActivity: true, answerCorrect: null, image:require('./assets/images/word_play/nose.png')},
      {id: 6, isSpeechActivity: false, answerCorrect: null, image:require('./assets/images/word_play/foot.png')},
      {id: 9, isSpeechActivity: true, answerCorrect: null, image:require('./assets/images/word_play/body.png')},      
      {id: 2, isSpeechActivity: false, answerCorrect: null, image:require('./assets/images/word_play/fingers.png')},
      {id: 4, isSpeechActivity: true, answerCorrect: null, image:require('./assets/images/word_play/ear.png')},
      {id: 7, isSpeechActivity: false, answerCorrect: null, image:require('./assets/images/word_play/feet.png')},
      {id: 10, isSpeechActivity: true, answerCorrect: null, image:require('./assets/images/word_play/mouth.png')},
      {id: 12, isEmpty: true},  
      {id: 5, isSpeechActivity: true, answerCorrect: null, image:require('./assets/images/word_play/finger.png')},      
      {id: 8, isSpeechActivity: false, answerCorrect: null, image:require('./assets/images/word_play/knee.png')},      
      {id: 11, isSpeechActivity: true, answerCorrect: null, image:require('./assets/images/word_play/toe.png')}
    ]
  }
];

const soundEffects = {
  click: require('./assets/audio/click.wav'),
  correctAnswer: require('./assets/audio/correct_answer.wav'),
  incorrectAnswer: require('./assets/audio/incorrect_answer.wav'),
  countdownTimerEnd: require('./assets/audio/countdown_timer_end_new.wav'),
  interactiveScreenSlideIn: require('./assets/audio/interactive_screen_slide_in.wav')
}

const clickSfx = new Sound(soundEffects.click, (error) => {console.log(error)});
const correctAnswerSfx = new Sound(soundEffects.correctAnswer, (error) => {console.log(error)});
const incorrectAnswerSfx = new Sound(soundEffects.incorrectAnswer, (error) => {console.log(error)});
const countdownTimerEndSfx = new Sound(soundEffects.countdownTimerEnd, (error) => {console.log(error)});
const interactiveScreenSlideInSfx = new Sound(soundEffects.interactiveScreenSlideIn, (error) => {console.log(error)});

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
     this.t = true;
     this.f = false;
     this.state = {
       ticketCounter: 0,
       countdownClock: false,
       countdownClockSeconds: 0,
       isVideoLoaded: false,
       isPaused: this.t,
       isMuted: this.f,
       interactiveContainer: false,
       trueFalse: false,
       trueFalseImageContainer: false,
       trueFalseButtonsContainer: false,
       trueFalseSelected: null,
       trueFalseCorrect: false,
       trueFalseCheckmark: false, 
       trueFalseCorrectAnswer: null,
       trueFalseImage: null,
       speechActivity: false,
       speechActivityImageContainer: false,
       speechActivityButtonsContainer: false,
       speechActivityCorrectAnswer: false,
       speechActivityIncorrectAnswer: false,
       speechActivityCheckmark: false,
       speechActivityImage: null,
       speechActivityRecording: false,
       speechActivityProcessing: false,
       speechActivityAudioPath: null,
       speechActivityScore: null,
       speechActivityProcessingAnim: new Animated.Value(0),
       speechActivityRecordingAnim: new Animated.Value(0),
       multipleChoice: false,
       multipleChoiceAnswer: null,
       multipleChoiceSelected: null,
       multipleChoiceOptions: [],
       multipleChoiceCheckmark: false,
       multipleChoiceCorrectAnswer: null,
       resultsScreen: false,
       resultsScreenOptions: [],
       resultsScreenFinalScores: []
     }
  }

  componentDidMount() {
    Orientation.lockToLandscape();

    AudioRecorder.onFinished = (data) => {
      this._finishRecording(data.status === "OK", data.audioFileURL);
    };
  };

  countdownClock() {
    this.setState(prevState => ({
      countdownClockSeconds: prevState.countdownClockSeconds - 1
    }));
  };

  incrementTicketCounter() {
    this.setState(prevState => ({
      ticketCounter: prevState.ticketCounter + 1
    }));
  };

  _setResultsScreen = (mockAPI) => {
    if(mockAPI.activityType === 'resultsScreen') {
      let resultsScreenOptions = this._checkFinalScoring(mockAPI.resultsScreenOptions);
      this.setState({
        resultsScreen: true,
        resultsScreenOptions: resultsScreenOptions
      });

      // this.clearResultsScreenTimeout = setTimeout(
      //   () => {
      //     this.setState({
      //       resultsScreen: false,
      //       resultsScreenOptions: []
      //     });
      //     clearTimeout(this.clearResultsScreenTimeout);
      //   }, mockAPI.resultsScreenDuration * 1000
      // );
    }
  }


  _checkFinalScoring = (resultsScreenOptions) => {
    let resultsScreenOptionsArr = resultsScreenOptions;
    let resultsScreenFinalScores = this.state.resultsScreenFinalScores;

    resultsScreenOptionsArr.forEach((resultsScreenOption) => {
      resultsScreenFinalScores.forEach((finalScore) => {
        if (resultsScreenOption.id === finalScore.id) {
          resultsScreenOption.isSpeechActivity = finalScore.activityType === 'speechActivity' ? true : false;
          resultsScreenOption.answerCorrect = finalScore.answerCorrect;
        }
      });
    });
    return resultsScreenOptionsArr;
  }

  _setResultsScreenFinalScore = (activityId, activityType, answerCorrect) => {
    let resultsScreenFinalObj = {id: activityId, activityType: activityType, answerCorrect: answerCorrect}
    let resultsScreenArr = this.state.resultsScreenFinalScores;
    resultsScreenArr.push(resultsScreenFinalObj);
    this.setState({
      resultsScreenFinalScores: resultsScreenArr
    })
  }

  _setActivityEnd = (activityType) => {
    if (activityType === 'trueFalse') {
      this.setState({
        interactiveContainer: false,
        trueFalse: false,
        trueFalseImageContainer: false,
        trueFalseButtonsContainer: false,
        trueFalseSelected: null,
        trueFalseCorrect: false,
        trueFalseCheckmark: false, 
        trueFalseCorrectAnswer: null,
        trueFalseImage: null,
      });
    }
    if (activityType === 'multipleChoice') {
      this.setState({
        interactiveContainer: false,
        multipleChoice: false,
        multipleChoiceAnswer: null,
        multipleChoiceSelected: null,
        multipleChoiceOptions: [],
        multipleChoiceCheckmark: false,
        multipleChoiceCorrectAnswer: null,
      });
    }
    if (activityType === 'speechActivity') {
      this.setState({
        interactiveContainer: false,
        speechActivity: false,
        speechActivityImageContainer: false,
        speechActivityButtonsContainer: false,
        speechActivityCorrectAnswer: false,
        speechActivityIncorrectAnswer: false,
        speechActivityImage: null,
        speechActivityRecording: false,
        speechActivityProcessing: false,
        speechActivityAudioPath: null,
        speechActivityScore: null,
        speechActivityCheckmark: false
      });
    }
  };

  _checkAnswer = (mockAPI) => {
    let activityId = mockAPI.activityId;
    let correctAnswer = mockAPI.correctAnswer;
    let activityType = mockAPI.activityType;
 
    if (activityType === 'trueFalse') {
      this.setState({
        trueFalseCorrectAnswer: correctAnswer
      });
      if (correctAnswer === this.state.trueFalseSelected) {
        correctAnswerSfx.play();
        this.incrementTicketCounter();
        this._setResultsScreenFinalScore(mockAPI.activityId, activityType, true)
      } else {
        incorrectAnswerSfx.play();
        this._setResultsScreenFinalScore(mockAPI.activityId, activityType, false)
      }
    }
    if (activityType === 'multipleChoice') {
      this.setState({
        multipleChoiceCorrectAnswer: correctAnswer
      });
      if (correctAnswer === this.state.multipleChoiceSelected) {
        correctAnswerSfx.play();
        this.incrementTicketCounter();
        this._setResultsScreenFinalScore(activityId, activityType, true)
      } else {
        incorrectAnswerSfx.play();
        this._setResultsScreenFinalScore(activityId, activityType, false)
      }
    }
    if (activityType === 'speechActivity') {
      if (parseFloat(this.state.speechActivityScore, 10) >= 0.5) {
        this.setState({
          speechActivityCorrectAnswer: true
        });
        this._setResultsScreenFinalScore(activityId, activityType, true);
        this.incrementTicketCounter();
        correctAnswerSfx.play();
      } else {
        this.setState({
          speechActivityIncorrectAnswer: true
        });
        this._setResultsScreenFinalScore(activityId, activityType, false);
        incorrectAnswerSfx.play();
      }
    } 
  };

  _setHighlightCorrectAnswer = (boolean, activityType, highlightCorrectAnswerDuration) => {
    if (activityType === 'trueFalse') {
      this.setState({
        trueFalseCheckmark: boolean
      });
    }
    if (activityType === 'multipleChoice') {
      this.setState({
        multipleChoiceCheckmark: boolean
      });
    };
    if (activityType === 'speechActivity') {
      this.setState({
        speechActivityProcessing: false,
      });
    }

    this.highlightCorrectAnswerTimeout = setTimeout(
      () => {
        this._setHighlightCorrectAnswer(false);
        clearTimeout(this.highlightCorrectAnswerTimeout);
      }, highlightCorrectAnswerDuration * 1000
    )
  };

  _setCountdownClock = (mockAPI) => {
    this._setCountdownClockDisplay(true);
    this._setCountdownClockSeconds(mockAPI.interactivityDuration);
    this.countdownClockInterval = setInterval(
      () => {
        if (this.state.countdownClockSeconds > 0) {
          this.countdownClock();
        }
        if (this.state.countdownClockSeconds === 0) {
          clearInterval(this.countdownClockInterval);
          countdownTimerEndSfx.play();
          this._stopInteractivity(mockAPI);
          this._setCountdownClockDisplay(false);
        }
      }, 1000
    );
  }

  _setCountdownClockSeconds = (countdownClockSeconds) => {
    this.setState({
      countdownClockSeconds: countdownClockSeconds
    });
  };

  _setCountdownClockDisplay = (boolean) => {
    this.setState({
      countdownClock: boolean
    });
  };

  _setInteractiveContainerDisplay = (boolean) => {
    if (boolean) {
      interactiveScreenSlideInSfx.play()
    }
    this.setState({
      interactiveContainer: boolean
    });
  };

  _setInteractiveTargetImageDisplay = (boolean, activityType, activityImages, activityOptions) => {
    if (activityType === 'trueFalse') {
      this.setState({
        trueFalseImageContainer: boolean,
        trueFalseImage: activityImages
      });
    }
    if (activityType === 'multipleChoice') {
      this.setState({
        multipleChoice: boolean,
        multipleChoiceOptions: activityOptions
      });
    }
    if (activityType === 'speechActivity') {
      this.setState({
        speechActivity: boolean,
        speechActivityImageContainer: boolean,
        speechActivityImage: activityImages
      });
    }

  };

  _setInteractiveTargetButtonsDisplay = (boolean, activityType) => {
    if(activityType === 'trueFalse') {
      this.setState({
        trueFalseButtonsContainer: boolean
      });
    }
    if(activityType === 'speechActivity') {
      this.setState({
        speechActivityButtonsContainer: boolean
      });
    }
  };

  _highlightTrueFalse = (answer) => {
    this.setState({
      trueFalseSelected: answer
    });
    this.highlightTimeout = setTimeout(
      () => {
        this._highlightTrueFalse(null);
        clearTimeout(this.highlightTimeout);
      }, 650
    );
  }

  _onPressTrueFalse = (answer) => {
    clickSfx.play((success) => {console.log(success)})
    this.setState({
      trueFalseSelected: answer
    });
  };

  _startInteractivity = (apiObject) => {
    if (apiObject.activityType === 'speechActivity') {
      var uniqId = Date.now();
      var uniqAudioPath = AudioUtils.DocumentDirectoryPath + '/' + apiObject.pcmFileName + '-' + uniqId + '.lpcm';
      this.setState({
        speechActivityAudioPath: uniqAudioPath,
        speechActivityCorrectAnswer: false,
        speechActivityIncorrectAnswer: false
      });
      this._startSpeechActivityRecording(uniqAudioPath, apiObject);
    }
  };

  _stopInteractivity = (apiObject) => {
    if(apiObject.activityType === 'speechActivity') {
      this._stopSpeechActivityRecording()
        .then((response) => 
          this._speechActivityAPIRequest(apiObject)
        )
    }
  }

  _prepareRecordingPath = (audioPath) => {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: "Low",
      AudioEncoding: "lpcm",
      AudioEncodingBitRate: 32000
    });
  }

  _finishRecording(didSucceed) {
    this.setState({ speechActivityRecordingFinished: didSucceed });
  }

  animateSpeechActivityProcessing = (iterations) => {
      this.state.speechActivityProcessingAnim.setValue(1)
      Animated.timing(                  
        this.state.speechActivityProcessingAnim,            
        {
          toValue: 0,                   
          duration: 1000,  
          iterations: iterations,
          useNativeDriver: true,
          easing: Easing.linear
        }
      ).start((animation) => {
        if (animation.finished) {
          this.animateSpeechActivityProcessing();
        }
      }); 
  }

animateSpeechActivityRecording = (iterations) => {
    this.state.speechActivityRecordingAnim.setValue(0)
    Animated.timing(
      this.state.speechActivityRecordingAnim,
      {
        toValue: 1,
        duration: 1000,
        iterations: iterations,
        useNativeDriver: true,
        easing: Easing.linear
      }
    ).start((animation) => {
        if (animation.finished) {
          this.animateSpeechActivityRecording();
        }
      })
  }

  async _startSpeechActivityRecording(speechActivityAudioPath, apiObject) {
      this._prepareRecordingPath(speechActivityAudioPath)
      try {
        const filePath = await AudioRecorder.startRecording();
        this.setState({
          speechActivityRecording: true
        });
        this.animateSpeechActivityRecording(apiObject.interactivityAnimationDuration)
      } catch (error) {
        console.log(error);
      }
  }

  async _stopSpeechActivityRecording() {
    try {
      const filePath = await AudioRecorder.stopRecording();
      this.setState({
        speechActivityRecording: false,
      });
      return filePath;
    } catch (error) {
      console.error(error);
    }
  }

  async _speechActivityAPIRequest(apiObject) {
    let apiUrl = 'http://admin.abcmouseforschools.com/http/VoiceScoreIndex';
    let path =  this.state.speechActivityAudioPath 
    let formData = new FormData();
    formData.append('file', { 
      uri: path,
      name: apiObject.pcmFileName,
      type: 'audio/wav'
    })
    formData.append('ref_text', apiObject.correctAnswer)

    this.setState({
      speechActivityProcessing: true
    });
    this.animateSpeechActivityProcessing(5);
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('responseJson good', responseJson)
      this.setState({
        speechActivityScore: responseJson.score,
      })
    })
    .catch((error) => {
      console.log('responseJson error', error)
      this.setState({
        speechActivityScore: 0,
      })
    })
  }

  _onPressMultipleChoice = (answer) => {
    clickSfx.play((success) => {console.log(success)})
    this.setState({
      multipleChoiceSelected: answer
    });
  };

  _onVideoLoad = (status) => {
    this.setState({
      isVideoLoaded: true
    });
  };

  _onPressPlay = () => {
    this.setState({
      isPaused: false
    });
  }

  _onPressPause = () => {
    this.setState({
      isPaused: true
    });
  }

  _onPressReloadVideo = () => {
    if(this.player !== null) {
      this.setState({
        ticketCounter: 0,
        countdownClock: false,
        countdownClockSeconds: 0,
        isVideoLoaded: true,
        isPaused: false,
        isMuted: false,
        interactiveContainer: false,
        trueFalse: false,
        trueFalseImageContainer: false,
        trueFalseButtonsContainer: false,
        trueFalseSelected: null,
        trueFalseCorrect: false,
        trueFalseCheckmark: false, 
        trueFalseCorrectAnswer: null,
        trueFalseImage: null,
        speechActivity: false,
        speechActivityImageContainer: false,
        speechActivityButtonsContainer: false,
        speechActivityCorrectAnswer: false,
        speechActivityIncorrectAnswer: false,
        speechActivityCheckmark: false,
        speechActivityImage: null,
        speechActivityRecording: false,
        speechActivityProcessing: false,
        speechActivityAudioPath: null,
        speechActivityScore: null,
        speechActivityProcessingAnim: new Animated.Value(0),
        speechActivityRecordingAnim: new Animated.Value(0),
        multipleChoice: false,
        multipleChoiceAnswer: null,
        multipleChoiceSelected: null,
        multipleChoiceOptions: [],
        multipleChoiceCheckmark: false,
        multipleChoiceCorrectAnswer: null,
        resultsScreen: false,
        resultsScreenOptions: [],
        resultsScreenFinalScores: []
      });
      this.player.seek(0);
    }
  }

  _onVideoProgress = (status) => {
    if (this.state.isVideoLoaded) {
      this._playInteractiveSequence(status)
    }
  };

  _onVideoMount = component => {
    this._video = component;
    this.player = this._video;
  };

  _playInteractiveSequence = (status) => {
    if (status && mockAPI) {
      console.log('status.currentTime', status.currentTime);
      let currentTime = Math.round(status.currentTime);
      console.log('currentTime', currentTime);
      mockAPI.forEach((mockAPI) => {  
        // activityStart: 3, //time to start interactive segment within overall video, in seconds
        // interactiveScreenStart: 3, //time to display interactive screen
        if (currentTime === mockAPI.activityStart ) {
          this._setInteractiveContainerDisplay(true);
        }

        //interactiveTargetImageStart: 5, //time to display activity target image or images
        if (currentTime === mockAPI.interactiveTargetImageStart ) {
          this._setInteractiveTargetImageDisplay(true, mockAPI.activityType, mockAPI.activityImages, mockAPI.activityOptions);
        }

        // interactiveButtonStart: 7, //time to display interactive buttons, non-clickable, could also be microphone
        if (currentTime === mockAPI.interactiveButtonStart ) {
          this._setInteractiveTargetButtonsDisplay(true, mockAPI.activityType);
        }
        
        // greenButtonHighlightStart: 9, //time to display green button highlight
        if (currentTime === mockAPI.greenButtonHighlightStart ) {
          this._highlightTrueFalse('green')
        }

        // redButtonHighlightStart: 8, //time to display red button highlight
        if (currentTime === mockAPI.redButtonHighlightStart ) {
          this._highlightTrueFalse('red')
        }
        
        // interactivityStart: 10, //time to allow user interactivity, start countdown clock 
        // countdownClockStart: 10, //time to display clock countdown, should be same as interactivityStart
        // interactivityDuration: 5, //total time for user interactivity, can use instead of countdown duration
        if (currentTime === mockAPI.interactivityStart ) {
          this._setCountdownClock(mockAPI);
          this._startInteractivity(mockAPI);
        }
        
        // highlightCorrectAnswerStart: 15, //time to highlight correct answer
        // highlightCorrectAnswerDuration: 3, //duration to highlight correct answer
        // check correctAnswer: 'red' //correct answer to the activity question
        if (currentTime === mockAPI.highlightCorrectAnswerStart ) {
          this._checkAnswer(mockAPI);
          this._setHighlightCorrectAnswer(true, mockAPI.activityType, mockAPI.highlightCorrectAnswerDuration);
        }
        
        // activityEnd: 20, //time to end activity, hide all screens
        if (currentTime === mockAPI.activityEnd ) {
          this._setActivityEnd(mockAPI.activityType);
        }

        // resultsScreenDuration: 10,
        if (currentTime === mockAPI.resultsScreenStart) {
          this._setResultsScreen(mockAPI);
        }

        if(currentTime === mockAPI.resultsScreenEnd) {
          this.setState({
            isPaused: true
          })
        }

      });
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar hidden={true}/>
        <View style={styles.videoContainer}>

          <View style={styles.reloadContainer}>
            <TouchableOpacity 
              onPress={() => this._onPressReloadVideo()}>
              <Icon style={{color: '#FFFFFF'}} name="ios-refresh-circle" size={40} color="#000000" />
            </TouchableOpacity>
          </View>
        
        {false &&
          <View style={styles.playPauseContainer}>
            {this.state.isPaused && this.state.isVideoLoaded &&
              <TouchableOpacity 
                onPress={() => this._onPressPlay()}>
                <Icon name="ios-play-outline" size={40} color="#FFFFFF" />
              </TouchableOpacity>
            }
            {!this.state.isPaused &&
              <TouchableOpacity 
                onPress={() => this._onPressPause()}>
                <Icon style={{color: '#FFFFFF'}} name="ios-pause-outline" size={40} color="#000000" />
              </TouchableOpacity>
            }
          </View>
          }

          <Video
            ref={this._onVideoMount}
            controls={true}
            rate={1.0}
            volume={1.0}
            paused={this.state.isPaused}
            muted={this.state.isMuted}
            onLoad={this._onVideoLoad}
            onProgress={this._onVideoProgress}
            style={[styles.video, { width: 668, height: 375 }]}
            source={videoSRC}
          />

          <View style={styles.ticketContainer}>
            <Image style={styles.ticketCounterIcon} source={require('./assets/images/tickets.png')} />
            <Text style={styles.ticketCounterPlus}>{ this.state.ticketCounter > 0 ? '+' : ''}</Text>
            <Text style={styles.ticketCounter}>{this.state.ticketCounter}</Text>
          </View>

            {this.state.countdownClock && 
              <View style={styles.countdownClockContainer}>
                <Image style={styles.countdownClockIcon} source={require('./assets/images/timer_white.png')} />
                <Text style={styles.countdownClockSeconds}>{this.state.countdownClockSeconds}</Text>
              </View>
            }
          
            {this.state.interactiveContainer && <View style={styles.interactiveContainer}>

              {this.state.trueFalseImageContainer && 
                <View style={styles.trueFalseImageContainer}>
                    <Image style={styles.trueFalseImage} source={this.state.trueFalseImage} />
                </View>
              }
              {this.state.trueFalseButtonsContainer && <View style={styles.trueFalseButtonsContainer}>
                <View style={[
                  styles.trueFalseHighlight,
                  this.state.trueFalseSelected === 'green' ? styles.trueFalseHighlightSelected : {}
                  ]}>
                  <TouchableOpacity 
                    onPress={() => this._onPressTrueFalse('green')}
                    disabled={Boolean(this.state.trueFalseSelected) || !this.state.countdownClock}
                    style={styles.trueFalseGreenYesButton}>
                      {this.state.trueFalseCheckmark && (this.state.trueFalseCorrectAnswer === 'green') &&
                        <View style={styles.trueFalseCheckmarkContainer}>
                          <Icon style={styles.checkmarkIcon} name="md-checkmark" size={40} color="#FFFFFF" />
                        </View>
                      }
                  </TouchableOpacity>
                </View>

                <View style={[
                  styles.trueFalseHighlight,
                  this.state.trueFalseSelected === 'red' ? styles.trueFalseHighlightSelected : {}
                  ]}>
                  <TouchableOpacity 
                    onPress={() => this._onPressTrueFalse('red')}
                    disabled={Boolean(this.state.trueFalseSelected) || !this.state.countdownClock}
                    style={styles.trueFalseRedNoButton}
                    >
                    {this.state.trueFalseCheckmark && (this.state.trueFalseCorrectAnswer === 'red') &&
                      <View style={styles.trueFalseCheckmarkContainer}>
                        <Icon style={styles.checkmarkIcon} name="md-checkmark" size={40} color="#FFFFFF" />
                      </View>
                    }
                  </TouchableOpacity>
                  </View>

              </View>}





              {this.state.speechActivity && 
                <View style={styles.speechActivityContainer}>

                {this.state.speechActivityImageContainer && 
                  <TouchableOpacity>
                    <View style={styles.speechActivityImageContainer}>
                      <Image style={styles.speechActivityImage} source={this.state.speechActivityImage} />
                    </View>
                  </TouchableOpacity>
                }

                {this.state.speechActivityButtonsContainer &&
                  <TouchableOpacity>
                    <View style={styles.speechActivityIconContainer}>

                    {this.state.speechActivityProcessing && 
                      <Animated.View style={
                        {borderColor: '#ffffff', borderWidth: 5, position: 'absolute', height: 90, width: 90, borderRadius: 100, opacity: this.state.speechActivityProcessingAnim}
                      }></Animated.View>
                    }

                    {this.state.speechActivityRecording && this.state.countdownClock &&
                       <Animated.View style={[{opacity: this.state.speechActivityRecordingAnim}, styles.speechActivityRecordingLeftOne]}></Animated.View>}
                    {this.state.speechActivityRecording && this.state.countdownClock &&
                       <Animated.View style={[{opacity: this.state.speechActivityRecordingAnim}, styles.speechActivityRecordingLeftTwo]}></Animated.View>}
                    {this.state.speechActivityRecording && this.state.countdownClock &&
                       <Animated.View style={[{opacity: this.state.speechActivityRecordingAnim}, styles.speechActivityRecordingLeftThree]}></Animated.View>}
                     
                      <View>
                        {!this.state.speechActivityCorrectAnswer && !this.state.speechActivityIncorrectAnswer &&
                          <View>
                           <Image style={styles.speechActivityIcon} source={require('./assets/images/tencent_microphone_sm.png')} />
                          </View>
                        }
                        {!this.state.speechActivityProcessing && this.state.speechActivityCorrectAnswer && !this.state.countdownClock &&
                          <Image style={styles.speechActivityIcon} source={require('./assets/images/happy_star.png')} />
                        }
                        {!this.state.speechActivityProcessing && this.state.speechActivityIncorrectAnswer && !this.state.countdownClock &&
                          <Image style={styles.speechActivityIcon} source={require('./assets/images/sad_star_blue.png')} />
                        }

                      </View>
                      {this.state.speechActivityRecording && this.state.countdownClock &&
                        <Animated.View style={[{opacity: this.state.speechActivityRecordingAnim}, styles.speechActivityRecordingRightOne]}></Animated.View>}
                      {this.state.speechActivityRecording && this.state.countdownClock &&
                        <Animated.View style={[{opacity: this.state.speechActivityRecordingAnim}, styles.speechActivityRecordingRightTwo]}></Animated.View>}
                      {this.state.speechActivityRecording && this.state.countdownClock &&
                        <Animated.View style={[{opacity: this.state.speechActivityRecordingAnim}, styles.speechActivityRecordingRightThree]}></Animated.View>}

                    </View>
                  </TouchableOpacity>
                }
              </View>
            }

              
              {this.state.multipleChoice && 
                <View style={styles.multipleChoiceContainer}>
                {this.state.multipleChoiceOptions.map((option, index) => {
                  return(
                    <TouchableOpacity
                      key={index}
                      disabled={Boolean(this.state.multipleChoiceSelected) || !this.state.countdownClock}    
                      onPress={() => this._onPressMultipleChoice(option.id)}>
                      <View style={[styles.multipleChoiceImageContainer,
                        this.state.multipleChoiceSelected === option.id ? styles.multipleChoiceImageContainerSelected : {},
                        (this.state.multipleChoiceCheckmark && (this.state.multipleChoiceCorrectAnswer === option.id)) ? styles.multipleChoiceImageContainerCorrect : {}
                        ]}>
                        <Image style={styles.multipleChoiceImage} source={option.image}  />
                        { this.state.multipleChoiceCheckmark && (this.state.multipleChoiceCorrectAnswer === option.id) &&
                          <View style={styles.multipleChoiceCheckmarkContainer}>
                            <Icon style={styles.checkmarkIcon} name="md-checkmark" size={40} color="#FFFFFF" />
                          </View>
                        }
                      </View>
                    </TouchableOpacity>
                    )
                })}
      
                </View>}         
            </View>}

          {this.state.resultsScreen &&
            <View style={styles.resultsScreen}>
              {this.state.resultsScreenOptions.map((result, index) => {
                return(
                  <View key={index} style={[styles.resultsScreenImageContainer,
                    result.isEmpty ? styles.resultsScreenIsEmpty : {}
                    ]}>
                    {!result.isSpeechActivity &&
                      <Image style={styles.resultsScreenImage} source={result.image} />
                    }
                    {result.isSpeechActivity && 
                      <View style={styles.resultsScreenSpeechActivityContainer}>
                        <Image style={styles.resultsScreenSpeechActivityImage} source={result.image} />
                        <View style={styles.resultsScreenSpeechActivityIconContainer}>
                          <Image style={styles.resultsScreenSpeechActivityIcon} source={require('./assets/images/tencent_microphone_sm.png')} />
                        </View>
                      </View>
                    }
                    {result.answerCorrect &&
                      <View style={styles.resultsScreenTicketIconContainer}>
                        <Image source={require('./assets/images/ticket_orange_one.png')} />
                      </View>
                    }
                  </View>
                )
              })}

            </View>
          }
        
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000'
  },
  videoContainer: {
    flex: 1,
    height: 375,
    width: 668,
    backgroundColor: '#000000',
    position: 'relative'
  },
  video: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0
  },
  reloadContainer: {
    position: 'absolute',
    top: 10,
    left: 15,
    zIndex: 10
  },
  playPauseContainer: {
    position: 'absolute',
    top: 10,
    left: 15,
    zIndex: 10
  },
  ticketContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
    width: 100,
    borderWidth: 0,
    borderColor: '#6C686D',
    backgroundColor: '#ffffff',
    position: 'absolute',
    right: 15,
    top: 10,
    borderRadius: 50
  },
  ticketCounter: {
    color: '#F0951C',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 30,
    height: 35,
    width: 20
  },
  ticketCounterIcon: {
    width: 32,
    height: 25,
    marginRight: 5
  },
  ticketCounterPlus: {
    color: '#F0951C',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 25,
    width: 15
  },
  countdownClockContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
    width: 100,
    borderColor: 'transparent',
    borderWidth: 3,
    borderRadius: 50,
    backgroundColor: 'rgb(36, 102, 215)',
    position: 'absolute',
    right: 120,
    top: 10
  },
  countdownClockSeconds: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 30,
    height: 35,
    width: 35
  },
  countdownClockIcon: {
    width: 25,
    height: 25
  },
  resultsScreen: {
    zIndex: 2,
    backgroundColor: 'rgba(36, 102, 215, 0.2)',
    height: 310,
    width: 430,
    borderWidth: 2,
    borderColor: 'rgb(60, 123, 218)',
    borderRadius: 10,
    marginTop: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 5,
    paddingRight: 10,
    paddingLeft: 10
  },
  resultsScreenImageContainer: {
    height: 90,
    width: 90,
    borderColor: 'rgb(36, 102, 215)',
    borderWidth: 2,
    borderRadius: 10,
    marginTop: 5,
    marginRight: 5,
    marginBottom: 5,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    position: 'relative'
  },
  resultsScreenImage: {
    height: 75,
    width: 75,
    alignSelf: 'center'
  },
  resultsScreenSpeechActivityContainer: {
    alignItems: 'center'
  }, 
  resultsScreenSpeechActivityImage: {
    height: 45,
    width: 45
  }, 
  resultsScreenSpeechActivityIconContainer: {
    width: 25,
    height: 25,
    alignSelf: 'center',
    marginTop: 5,
    backgroundColor: 'rgb(47, 154, 224)',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'rgb(47, 154, 224)',
    borderWidth: 1
  }, 
  resultsScreenSpeechActivityIcon: {
    height: 22,
    width: 14
  },
  resultsScreenTicketIconContainer: {
    position: 'absolute',
    top: 5,
    right: -10,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  resultsScreenIsEmpty: {
    backgroundColor: 'transparent',
    borderColor: 'transparent'
  },
  interactiveContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'absolute', 
    zIndex: 2,
    top: 55,
    right: 15, 
    backgroundColor: 'rgba(205, 236, 253, 0.6)',
    height: 300,
    width: 300,
    borderWidth: 2,
    borderColor: 'rgb(36, 102, 215)',
    borderRadius: 10
  },
  trueFalseImageContainer: {
    zIndex: 3,
    position: 'relative',
    height: 165,
    width: 165,
    marginTop: 12,
    borderWidth: 2, 
    borderColor: 'rgb(36, 102, 215)',
    borderRadius: 10,
    backgroundColor: 'rgba(60, 123, 218, 0.5)',
    justifyContent: 'center'
  },
  trueFalseImage: {
    alignSelf: 'center',
    width: 135, 
    height: 135,
    borderColor: '#ffffff',
    borderWidth: 3,
    borderRadius: 10
  },
  trueFalseButtonsContainer: {
    flexDirection: 'row',
    marginTop: 15,
    width: 270,
    justifyContent: 'space-around'
  },
  trueFalseRedNoButton: {
    height: 75,
    width: 75,
    backgroundColor: '#C30016',
    borderRadius: 50,
    zIndex: 5,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C30016',
    borderWidth: 1
  },
  trueFalseGreenYesButton: {
    height: 75,
    width: 75,
    backgroundColor: '#48AA09',
    borderRadius: 50,
    zIndex: 5,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#48AA09',
    borderWidth: 1
  },
  trueFalseHighlight: {
    borderColor: 'transparent',
    height: 90,
    width: 90,
    backgroundColor: 'transparent',
    borderRadius: 100,
    borderWidth: 10,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  trueFalseHighlightSelected: {
    borderColor: 'rgb(240, 149, 28)'
  },
  trueFalseCheckmarkContainer: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    backgroundColor: '#48AA09',
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: '#ffffff',
    borderWidth: 3
  },
  checkmarkIcon: {
    marginTop: -3
  },
  speechActivityImageContainer: {
    zIndex: 3,
    position: 'relative',
    height: 165,
    width: 165,
    marginTop: 12,
    borderWidth: 2, 
    borderColor: 'rgb(36, 102, 215)',
    borderRadius: 10,
    backgroundColor: 'rgba(60, 123, 218, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  speechActivityImage: {
    alignSelf: 'center',
    width: 135, 
    height: 135,
    borderColor: '#ffffff',
    borderWidth: 3,
    borderRadius: 10
  },
  speechActivityIconContainer: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    marginTop: 15,
    zIndex: 3,
    backgroundColor: 'rgb(47, 154, 224)',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'rgb(47, 154, 224)',
    borderWidth: 1
  },
  speechActivityRecordingLeftOne: {
    top: 40, 
    left: 10, 
    backgroundColor: 'rgb(8, 50, 90)', 
    height: 10, 
    width: 3, 
    position: 'absolute'
  },
  speechActivityRecordingLeftTwo: {
    top: 35, 
    left: 15, 
    backgroundColor: 'rgb(8, 50, 90)', 
    height: 20, 
    width: 3, 
    position: 'absolute'
  },
  speechActivityRecordingLeftThree: {
    top: 30, 
    left: 20, 
    backgroundColor: 'rgb(8, 50, 90)', 
    height: 30, 
    width: 3, 
    position: 'absolute'
  },
  speechActivityRecordingRightOne: {
    top: 40, 
    right: 10, 
    backgroundColor: 'rgb(8, 50, 90)', 
    height: 10, 
    width: 3, 
    position: 'absolute'
  },
  speechActivityRecordingRightTwo: {
    top: 35, 
    right: 15, 
    backgroundColor: 'rgb(8, 50, 90)', 
    height: 20, 
    width: 3, 
    position: 'absolute'
  },
  speechActivityRecordingRightThree: {
    top: 30, 
    right: 20, 
    backgroundColor: 'rgb(8, 50, 90)', 
    height: 30, 
    width: 3, 
    position: 'absolute'
  },
  multipleChoiceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
    marginRight: 5,
    marginLeft: 5
  },
  multipleChoiceImageContainer: {
    zIndex: 3,
    position: 'relative',
    height: 130,
    width: 130,
    marginTop: 5,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2, 
    borderColor: 'rgb(36, 102, 215)',
    borderRadius: 10,
    backgroundColor: 'rgba(60, 123, 218, 0.5)',
  },
  multipleChoiceCheckmarkContainer: {
    position: 'absolute',
    bottom: -7,
    right: -7,
    backgroundColor: '#48AA09',
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: '#ffffff',
    borderWidth: 3
  },
  multipleChoiceImageContainerSelected: {
    borderWidth: 10, 
    borderColor: 'rgb(240, 149, 28)',
    backgroundColor: 'rgb(240, 149, 28)'
  },
  multipleChoiceImageContainerCorrect: {
    borderWidth: 10, 
    borderColor: '#48AA09',
    backgroundColor: '#48AA09'
  },
  multipleChoiceImage: {
    alignSelf: 'center',
    height: 110,
    width: 110,
    borderColor: '#ffffff',
    borderWidth: 3,
    borderRadius: 10
  }
});
