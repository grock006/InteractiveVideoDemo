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
import Orientation from 'react-native-orientation';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import videoSRC from './assets/videos/video_030718.mp4'

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const mockAPI = [
  {
    activityId: 1,
    activityType: 'trueFalse',
    interactive: true,
    activityStart: 10,//54, //time to start interactive segment within overall video, in seconds
    interactiveScreenStart: 10, //54, //time to display interactive screen
    interactiveTargetImageStart: 10, //54, //time to display activity target image or images
    interactiveButtonStart: 10, //54, //time to display interactive buttons, non-clickable, could also be microphone
    greenButtonHighlightStart: 14, //58, //time to display green button highlight
    redButtonHighlightStart: 15, //59, //time to display red button highlight
    interactivityStart: 17, //60, //time to allow user interactivity, start countdown clock 
    countdownClockStart: 17, //60, //time to display clock countdown, should be same as interactivityStart
    interactivityDuration: 3, //total time for user interactivity, can use instead of countdown duration
    hightlightCorrectAnswerStart: 21, //time to highlight correct answer
    hightlightCorrectAnswerDuration: 3, //duration to highlight correct answer
    activityEnd: 24, //time to end all activity screens
    activityTotalDuration: 18, //total time for activity start to finish, everything included
    activityImages: require('./assets/images/tf/s1_eyes.png'), //image assets, target images, interactive icons, etc.
    correctAnswer: 'green' //correct answer to the activity question//
  },
  {
    activityId: 2,
    activityType: 'trueFalse',
    interactive: true,
    activityStart: 25, //76,
    interactiveScreenStart: 25, //76,
    interactiveTargetImageStart: 25, //76,
    interactiveButtonStart: 25, //76,
    greenButtonHighlightStart: 27, 
    redButtonHighlightStart: 28, 
    interactivityStart: 29, //83,
    countdownClockStart: 29, //83,
    interactivityDuration: 2,
    hightlightCorrectAnswerStart: 32,
    hightlightCorrectAnswerDuration: 3,
    activityEnd: 35,
    activityImages: require('./assets/images/tf/s1_knee.png'),
    correctAnswer: 'red'
  },
  {
    activityId: 3,
    activityType: 'speechActivity',
    interactive: true,
    activityStart: 44, //124,
    interactiveScreenStart: 44, //124,
    interactiveTargetImageStart: 44, //124,
    interactiveButtonStart: 44, //124,
    interactivityStart: 44, //127, //start speech recording //set highlight class (animation later)
    countdownClockStart: 44, //127,
    interactivityDuration: 2, //stop speech recording //remove highlight class
    interactivityAnimationDuration: 2,
    activityEnd: 51,
    activityImages: require('./assets/images/mc/nose.png'),
    correctAnswer: 'this is a nose',
    pcmFileName: 'nose'
  },
  {
    activityId: 4,
    activityType: 'speechActivity',
    interactive: true,
    activityStart: 52,
    interactiveScreenStart: 52,
    interactiveTargetImageStart: 52,
    interactiveButtonStart: 52,
    interactivityStart: 52,
    countdownClockStart: 52,
    interactivityDuration: 2,
    interactivityAnimationDuration: 2,
    activityEnd: 58,
    activityImages: require('./assets/images/mc/ear.png'),
    correctAnswer: 'these are ears',
    pcmFileName: 'ears'
  },
  {
    activityId: 5,
    activityType: 'speechActivity',
    interactive: true,
    activityStart: 59,
    interactiveScreenStart: 59,
    interactiveTargetImageStart: 59,
    interactiveButtonStart: 59,
    interactivityStart: 60,
    countdownClockStart: 60,
    interactivityDuration: 2,
    interactivityAnimationDuration: 2,
    activityEnd: 65,
    activityImages: require('./assets/images/mc/finger.png'),
    correctAnswer: 'these are my fingers',
    pcmFileName: 'fingers'
  },
  {
    activityId: 6,
    activityType: 'multipleChoice',
    interactive: true,
    activityStart: 76, //192,
    interactiveScreenStart: 76, //192,
    interactiveTargetImageStart: 76, //192,
    interactivityStart: 80, //195,
    countdownClockStart: 80, //195,
    interactivityDuration: 3,
    hightlightCorrectAnswerStart: 84,
    hightlightCorrectAnswerDuration: 2,
    activityEnd: 86,
    activityImages: [ 
      require('./assets/images/mc/foot.png'), 
      require('./assets/images/mc/ear.png'), 
      require('./assets/images/mc/finger.png'), 
      require('./assets/images/mc/head.png')
    ],
    correctAnswer: 1,
  },
  {
    activityId: 7,
    activityType: 'multipleChoice',
    interactive: true,
    activityStart: 87, //207,
    interactiveScreenStart: 87, //207,
    interactiveTargetImageStart: 87, //207,
    interactivityStart: 89,
    countdownClockStart: 89,
    interactivityDuration: 3,
    hightlightCorrectAnswerStart: 93, //216,
    hightlightCorrectAnswerDuration: 3,
    activityEnd: 96,
    activityImages: [ 
      require('./assets/images/mc/body.png'), 
      require('./assets/images/mc/finger.png'), 
      require('./assets/images/mc/feet.png'), 
      require('./assets/images/mc/hand.png')
    ],
    correctAnswer: 3,
  },
  {
    activityId: 8,
    activityType: 'multipleChoice',
    interactive: true,
    activityStart: 97, //207,
    interactiveScreenStart: 97, //207,
    interactiveTargetImageStart: 97, //207,
    interactivityStart: 99,
    countdownClockStart: 99,
    interactivityDuration: 4,
    hightlightCorrectAnswerStart: 103, //216,
    hightlightCorrectAnswerDuration: 3,
    activityEnd: 104,
    activityImages: [ 
      require('./assets/images/mc/ear.png'), 
      require('./assets/images/mc/foot.png'), 
      require('./assets/images/mc/head.png'), 
      require('./assets/images/tf/s1_knee.png')
    ],
    correctAnswer: 4,
  },
  {
    activityId: 9,
    activityType: 'speechActivity',
    interactive: true,
    activityStart: 113, //46, //124,
    interactiveScreenStart: 113, //124,
    interactiveTargetImageStart: 113, //124,
    interactiveButtonStart: 113, //124,
    interactivityStart: 113, //127, //start speech recording //set highlight class (animation later)
    countdownClockStart: 113, //127,
    interactivityDuration: 2, //stop speech recording //remove highlight class
    interactivityAnimationDuration: 2,
    activityEnd: 120,
    activityImages: require('./assets/images/mc/body.png'),
    correctAnswer: 'body',
    pcmFileName: 'body'
  },
  {
    activityId: 10,
    activityType: 'speechActivity',
    interactive: true,
    activityStart: 121, //46, //124,
    interactiveScreenStart: 121, //124,
    interactiveTargetImageStart: 121, //124,
    interactiveButtonStart: 121, //124,
    interactivityStart: 121, //127, //start speech recording //set highlight class (animation later)
    countdownClockStart: 121, //127,
    interactivityDuration: 2, //stop speech recording //remove highlight class
    interactivityAnimationDuration: 2,
    activityEnd: 129,
    activityImages: require('./assets/images/mc/mouth.png'),
    correctAnswer: 'mouth',
    pcmFileName: 'mouth'
  },
  {
    activityId: 11,
    activityType: 'speechActivity',
    interactive: true,
    activityStart: 130, //46, //124,
    interactiveScreenStart: 130, //124,
    interactiveTargetImageStart: 130, //124,
    interactiveButtonStart: 130, //124,
    interactivityStart: 130, //127, //start speech recording //set highlight class (animation later)
    countdownClockStart: 130, //127,
    interactivityDuration: 2, //stop speech recording //remove highlight class
    interactivityAnimationDuration: 2,
    activityEnd: 137,
    activityImages: require('./assets/images/mc/toe.png'),
    correctAnswer: 'toe',
    pcmFileName: 'toe'
  }
];

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
     this.t = true;
     this.f = false;
     this.state = {
       ticketCounter: 0,
       countdownClock: false,
       countdownClockSeconds: null,
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
       multipleChoiceImages: [],
       multipleChoiceCheckmark: false,
       multipleChoiceCorrectAnswer: null,
       resultsScreen: false
     }
  }

  componentDidMount() {
    Orientation.lockToLandscape();//ComponentWillMount?

    AudioRecorder.onFinished = (data) => {
      this._finishRecording(data.status === "OK", data.audioFileURL);
    };
  };

  componentWillUnmount() {
    //cleanup
  }

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
        multipleChoiceImages: [],
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

  _checkAnswer = (correctAnswer, activityType) => {
    if (activityType === 'trueFalse') {
      this.setState({
        trueFalseCorrectAnswer: correctAnswer
      });
      if (correctAnswer === this.state.trueFalseSelected) {
        this.incrementTicketCounter();
      }
    }
    if (activityType === 'multipleChoice') {
      this.setState({
        multipleChoiceCorrectAnswer: correctAnswer
      });
      if (correctAnswer === this.state.multipleChoiceSelected) {
        this.incrementTicketCounter();
      }
    } 
  };

  _checkSpeechActivityAnswer = (speechScore) => {
    if (parseFloat(speechScore, 10) >= 0.5) {
      this.setState({
        speechActivityProcessing: false,
        speechActivityCorrectAnswer: true
      });
      this.incrementTicketCounter();
    } else {
      this.setState({
        speechActivityProcessing: false,
        speechActivityIncorrectAnswer: true
      });
    }
  }

  _setHighlightCorrectAnswer = (boolean, activityType) => {
    if (activityType === 'trueFalse') {
      this.setState({
        trueFalseCheckmark: boolean
      });
    }
    if (activityType === 'multipleChoice') {
      this.setState({
        multipleChoiceCheckmark: boolean
      });
    }
  };

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
    this.setState({
      interactiveContainer: boolean
    });
  };

  _setInteractiveTargetImageDisplay = (boolean, activityType, activityImages) => {
    if (activityType === 'trueFalse') {
      this.setState({
        trueFalseImageContainer: boolean,
        trueFalseImage: activityImages
      });
    }
    if (activityType === 'multipleChoice') {
      this.setState({
        multipleChoice: boolean,
        multipleChoiceImages: activityImages
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

  _onPressTrueFalse = (answer) => {
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
      this.setState({
        speechActivityScore: responseJson.score,
        speechActivityProcessing: false
      })
      this._checkSpeechActivityAnswer(responseJson.score, 'speechActivity')
    })
    .catch((error) => {
      this._checkSpeechActivityAnswer('0', 'speechActivity')
    })
  }

  _onPressMultipleChoice = (answer) => {
    this.setState({
      multipleChoiceSelected: answer
    });
  };

  _onVideoLoad = (status) => {
    this.setState({
      isVideoLoaded: true
    });
  };

    _onPressReloadVideo = () => {
    if(this.player !== null) {
      this.player.seek(0);
      this.setState({
        ticketCounter: 0,
        countdownClock: false,
        countdownClockSeconds: null,
        isVideoLoaded: false,
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
        speechActivityRecording: true,
        speechActivityProcessing: false,
        speechActivityAudioPath: null,
        speechActivityScore: null,
        speechActivityProcessingAnim: new Animated.Value(0),
        speechActivityRecordingAnim: new Animated.Value(0),
        multipleChoice: false,
        multipleChoiceAnswer: null,
        multipleChoiceSelected: null,
        multipleChoiceImages: [],
        multipleChoiceCheckmark: false,
        multipleChoiceCorrectAnswer: null,
        resultsScreen: false
      });
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

      mockAPI.forEach((mockAPI) => {
        // activityStart: 3, //time to start interactive segment within overall video, in seconds
        // interactiveScreenStart: 3, //time to display interactive screen
        if (Math.round(status.currentTime) === mockAPI.activityStart ) {
          this._setInteractiveContainerDisplay(true);
        }

        //interactiveTargetImageStart: 5, //time to display activity target image or images
        if (Math.round(status.currentTime) === mockAPI.interactiveTargetImageStart ) {
          this._setInteractiveTargetImageDisplay(true, mockAPI.activityType, mockAPI.activityImages);
        }

        // interactiveButtonStart: 7, //time to display interactive buttons, non-clickable, could also be microphone
        if (Math.round(status.currentTime) === mockAPI.interactiveButtonStart ) {
          this._setInteractiveTargetButtonsDisplay(true, mockAPI.activityType);
        }
        
        // redButtonHighlightStart: 8, //time to display red button highlight
        if (Math.round(status.currentTime) === mockAPI.redButtonHighlightStart ) {
          this._onPressTrueFalse('red')
          this.redButtonHighlightTimeout = setTimeout(
            () => {
              this._onPressTrueFalse(null)
            }, 650
          );
        }

        // greenButtonHighlightStart: 9, //time to display green button highlight
        if (Math.round(status.currentTime) === mockAPI.greenButtonHighlightStart ) {
          this._onPressTrueFalse('green')
          this.greenButtonHighlightTimeout = setTimeout(
            () => {
              this._onPressTrueFalse(null);
            }, 650
          );
        }
        
        // interactivityStart: 10, //time to allow user interactivity, start countdown clock 
        // countdownClockStart: 10, //time to display clock countdown, should be same as interactivityStart
        // interactivityDuration: 5, //total time for user interactivity, can use instead of countdown duration
        if (Math.round(status.currentTime) === mockAPI.interactivityStart ) {
          this._setCountdownClockDisplay(true);
          this._setCountdownClockSeconds(mockAPI.interactivityDuration);
          this._startInteractivity(mockAPI);
          this.countdownClockInterval = setInterval(
            () => {
              this.countdownClock()
              if(this.state.countdownClockSeconds < 0) {
                clearInterval(this.countdownClockInterval);
                this._stopInteractivity(mockAPI);
                this._setCountdownClockDisplay(false);
              }
            }, 1000
          );
        }
        
        // hightlightCorrectAnswerStart: 15, //time to highlight correct answer
        // hightlightCorrectAnswerDuration: 3, //duration to highlight correct answer
        // check correctAnswer: 'red' //correct answer to the activity question
        if (Math.round(status.currentTime) === mockAPI.hightlightCorrectAnswerStart ) {
          this._checkAnswer(mockAPI.correctAnswer, mockAPI.activityType);
          this._setHighlightCorrectAnswer(true, mockAPI.activityType);
          this.highlightCorrectAnswerTimeout = setTimeout(
            () => {
              this._setHighlightCorrectAnswer(false, mockAPI.activityType);
            }, mockAPI.hightlightCorrectAnswerDuration * 1000
          )
        }
        
        // activityEnd: 20, //time to end activity, hide all screens
        if (Math.round(status.currentTime) === mockAPI.activityEnd ) {
          this._setActivityEnd(mockAPI.activityType);
          clearTimeout(this.highlightCorrectAnswerTimeout);
          clearTimeout(this.greenButtonHighlightTimeout);
          clearTimeout(this.redButtonHighlightTimeout);
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
              <Image style={styles.reloadIcon} source={require('./assets/images/refresh.png')} />
            </TouchableOpacity>
          </View>
          <Video
            ref={this._onVideoMount}
            controls={true}
            rate={1.0}
            volume={1.0}
            paused={this.state.isPaused}
            muted={this.state.isMuted}
            onLoad={this._onVideoLoad}
            onProgress={this._onVideoProgress}
            style={[styles.video, { width: 736, height: 414 }]}
            source={videoSRC}
          />

          <View style={styles.ticketContainer}>
            <Image style={styles.ticketCounterIcon} source={require('./assets/images/tickets.png')} />
            <Text style={styles.ticketCounterPlus}>{ this.state.ticketCounter > 0 ? '+' : ''}</Text>
            <Text style={styles.ticketCounter}>{this.state.ticketCounter}</Text>
          </View>

            {this.state.countdownClock && 
              <View style={styles.countdownClockContainer}>
                <Image style={styles.countdownClockIcon} source={require('./assets/images/timer.png')} />
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
                  styles.trueFalseGreenYesButtonHighlight,
                  this.state.trueFalseSelected === 'green' ? styles.trueFalseGreenYesButtonHighlightSelected : {}
                  ]}>
                  <TouchableOpacity 
                    onPress={() => this._onPressTrueFalse('green')}
                    disabled={Boolean(this.state.trueFalseSelected) || !this.state.countdownClock}
                    style={styles.trueFalseGreenYesButton}>
                      {this.state.trueFalseCheckmark && (this.state.trueFalseCorrectAnswer === 'green') &&
                        <View style={styles.trueFalseCheckmarkContainer}>
                          <Image source={require('./assets/images/checkmark.png')} />
                        </View>
                      }
                  </TouchableOpacity>
                </View>

                <View style={[
                  styles.trueFalseRedNoButtonHighlight,
                  this.state.trueFalseSelected === 'red' ? styles.trueFalseRedNoButtonHighlightSelected : {}
                  ]}>
                  <TouchableOpacity 
                    onPress={() => this._onPressTrueFalse('red')}
                    disabled={Boolean(this.state.trueFalseSelected) || !this.state.countdownClock}
                    style={styles.trueFalseRedNoButton}
                    >
                    {this.state.trueFalseCheckmark && (this.state.trueFalseCorrectAnswer === 'red') &&
                      <View style={styles.trueFalseCheckmarkContainer}>
                        <Image source={require('./assets/images/checkmark.png')} />
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
                        {this.state.speechActivityCorrectAnswer && !this.state.countdownClock &&
                          <Image style={styles.speechActivityIcon} source={require('./assets/images/happy_star.png')} />
                        }
                        {this.state.speechActivityIncorrectAnswer && !this.state.countdownClock &&
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
                  <TouchableOpacity
                    disabled={Boolean(this.state.multipleChoiceSelected) || !this.state.countdownClock}    
                    onPress={() => this._onPressMultipleChoice(1)}>
                    <View style={[styles.multipleChoiceImageContainer,
                      this.state.multipleChoiceSelected === 1 ? styles.multipleChoiceImageContainerSelected : {},
                      (this.state.multipleChoiceCheckmark && (this.state.multipleChoiceCorrectAnswer === 1)) ? styles.multipleChoiceImageContainerCorrect : {}
                      ]}>
                      <Image style={styles.multipleChoiceImage} source={this.state.multipleChoiceImages[0]}  />
                      { this.state.multipleChoiceCheckmark && (this.state.multipleChoiceCorrectAnswer === 1) &&
                        <View style={styles.multipleChoiceCheckmarkContainer}>
                          <Image source={require('./assets/images/green_circle_checkmark.png')} />
                        </View>
                      }
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={Boolean(this.state.multipleChoiceSelected) || !this.state.countdownClock}
                    onPress={() => this._onPressMultipleChoice(2)}>
                    <View style={[styles.multipleChoiceImageContainer,
                       this.state.multipleChoiceSelected === 2 ? styles.multipleChoiceImageContainerSelected : {},
                       (this.state.multipleChoiceCheckmark && (this.state.multipleChoiceCorrectAnswer === 2)) ? styles.multipleChoiceImageContainerCorrect : {}
                      ]}>
                      <Image style={styles.multipleChoiceImage} source={this.state.multipleChoiceImages[1]}   />
                      { this.state.multipleChoiceCheckmark && (this.state.multipleChoiceCorrectAnswer === 2) &&
                        <View style={styles.multipleChoiceCheckmarkContainer}>
                          <Image source={require('./assets/images/green_circle_checkmark.png')} />
                        </View>
                      }
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={Boolean(this.state.multipleChoiceSelected) || !this.state.countdownClock}
                    onPress={() => this._onPressMultipleChoice(3)}>              
                    <View style={[styles.multipleChoiceImageContainer,
                      this.state.multipleChoiceSelected === 3 ? styles.multipleChoiceImageContainerSelected : {},
                      (this.state.multipleChoiceCheckmark && (this.state.multipleChoiceCorrectAnswer === 3)) ? styles.multipleChoiceImageContainerCorrect : {}
                      ]}>
                      <Image style={styles.multipleChoiceImage} source={this.state.multipleChoiceImages[2]}   />
                      { this.state.multipleChoiceCheckmark && (this.state.multipleChoiceCorrectAnswer === 3) &&
                        <View style={styles.multipleChoiceCheckmarkContainer}>
                          <Image source={require('./assets/images/green_circle_checkmark.png')} />
                        </View>
                      }
                    </View>
                  </TouchableOpacity>                  
                  <TouchableOpacity
                    disabled={Boolean(this.state.multipleChoiceSelected) || !this.state.countdownClock}
                    onPress={() => this._onPressMultipleChoice(4)}>
                    <View style={[styles.multipleChoiceImageContainer,
                      this.state.multipleChoiceSelected === 4 ? styles.multipleChoiceImageContainerSelected : {},
                      (this.state.multipleChoiceCheckmark && (this.state.multipleChoiceCorrectAnswer === 4)) ? styles.multipleChoiceImageContainerCorrect : {}
                      ]}>
                      <Image style={styles.multipleChoiceImage} source={this.state.multipleChoiceImages[3]}   />
                      { this.state.multipleChoiceCheckmark && (this.state.multipleChoiceCorrectAnswer === 4) &&
                        <View style={styles.multipleChoiceCheckmarkContainer}>
                          <Image source={require('./assets/images/green_circle_checkmark.png')} />
                        </View>
                      }
                    </View>
                  </TouchableOpacity>
                </View>}         
            </View>}

          {this.state.resultsScreen &&
            <View style={styles.resultsScreen}>
              <Text style={styles.resultsScreenText}>Unit Review Scorecard</Text>
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
    height: 414,
    width: 736,
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
    top: 5,
    left: 5,
    zIndex: 10
  },
  reloadIcon: {
    height: 35,
    width: 35
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
    backgroundColor: '#ffffff',
    position: 'absolute',
    right: 120,
    top: 10
  },
  countdownClockSeconds: {
    color: '#F0951C',
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
    backgroundColor: 'rgb(213, 221, 234)',
    height: 280,
    width: 450,
    borderWidth: 5,
    borderColor: 'rgb(60, 123, 218)',
    borderRadius: 15,
    alignSelf: 'center'
  },
  resultsScreenText: {
    alignSelf: 'center',
    color: '#001A66',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 20
  },
  interactiveContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'absolute', 
    zIndex: 2,
    top: 60,
    right: 15, 
    backgroundColor: 'rgba(213, 221, 234, 0.5)',
    height: 290,
    width: 350,
    borderWidth: 1,
    borderColor: '#898989',
    borderRadius: 15,
  },
  trueFalseImageContainer: {
    zIndex: 3,
    position: 'relative',
    height: 150,
    width: 250,
    marginTop: 15,
    borderWidth: 2,
    borderColor: '#898989',
    borderRadius: 15,
    backgroundColor: '#ffffff',
    justifyContent: 'center'
  },
  trueFalseImage: {
    alignSelf: 'center',
    width: 135, 
    height: 135
  },
  trueFalseButtonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    width: 270,
    justifyContent: 'space-between'
  },
  trueFalseCheckmarkContainer: {
  },
  trueFalseRedNoButton: {
    height: 75,
    width: 75,
    backgroundColor: '#C30016',
    borderRadius: 50,
    borderColor: 'transparent',
    borderWidth: 10,
    zIndex: 5,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  },
  trueFalseRedNoButtonHighlight: {
    borderColor: 'rgba(195, 0, 22, 0.0)',
    height: 100,
    width: 100,
    backgroundColor: 'transparent',
    borderRadius: 100,
    borderWidth: 5,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  trueFalseRedNoButtonHighlightSelected: {
    borderColor: 'rgba(195, 0, 22, 1)'
  },
  trueFalseDisabled: {
    opacity: 0.4
  },
  trueFalseGreenYesButton: {
    height: 75,
    width: 75,
    backgroundColor: '#48AA09',
    borderRadius: 50,
    borderColor: 'transparent',
    borderWidth: 10,
    zIndex: 5,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  },
  trueFalseGreenYesButtonHighlight: {
    borderColor: 'transparent',
    height: 100,
    width: 100,
    backgroundColor: 'transparent',
    borderRadius: 100,
    borderWidth: 5,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  trueFalseGreenYesButtonHighlightSelected: {
    borderColor: '#48AA09'
  },
  speechActivityImageContainer: {
    zIndex: 3,
    position: 'relative',
    height: 140,
    width: 240,
    marginTop: 15,
    borderWidth: 2,
    borderColor: '#898989',
    borderRadius: 15,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  speechActivityImage: {
    height: 120,
    width: 120,
    alignSelf: 'center'
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
    justifyContent: 'center'
  },
  speechActivityIcon: {
    // width: 50,
    // height: 50
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
    width: 160,
    borderWidth: 2,
    borderColor: '#898989',
    borderRadius: 15,
    backgroundColor: '#ffffff',
    marginTop: 5,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  multipleChoiceCheckmarkContainer: {
    position: 'absolute',
    top: 5,
    left: 5
  },
  multipleChoiceImageContainerSelected: {
    borderWidth: 10, 
    borderColor: 'rgb(242, 157, 48)'
  },
  multipleChoiceImageContainerCorrect: {
    borderWidth: 10, 
    borderColor: '#48AA09'
  },
  multipleChoiceImage: {
    alignSelf: 'center',
    height: 115,
    width: 115
  }
});
