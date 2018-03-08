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

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const mockAPI = [
  {
    activityId: 2,
    activityType: 'speechActivity',
    interactive: true,
    activityStart: 124,
    interactiveScreenStart: 124,
    interactiveTargetImageStart: 124,
    interactiveButtonStart: 124,
    interactivityStart: 127, //start speech recording //set highlight class (animation later)
    countdownClockStart: 127,
    interactivityDuration: 2, //stop speech recording //remove highlight class
    interactivityAnimationDuration: 7,
    hightlightCorrectAnswerStart: 134,
    hightlightCorrectAnswerDuration: 3,
    activityEnd: 137,
    activityImages: require('./assets/images/sa/s2_nose.png'),
    correctAnswer: 'this is a nose',
    pcmFileName: 'nose'
  },
  {
    activityId: 3,
    activityType: 'speechActivity',
    interactive: true,
    activityStart: 138,
    interactiveScreenStart: 138,
    interactiveTargetImageStart: 138,
    interactiveButtonStart: 138,
    interactivityStart: 143,
    countdownClockStart: 143,
    interactivityDuration: 2,
    interactivityAnimationDuration: 7,
    hightlightCorrectAnswerStart: 150,
    hightlightCorrectAnswerDuration: 3,
    activityEnd: 153,
    activityImages: require('./assets/images/sa/s2_ears.png'),
    correctAnswer: 'these are ears',
    pcmFileName: 'ears'
  },
  {
    activityId: 4,
    activityType: 'trueFalse',
    interactive: true,
    activityStart: 54, //time to start interactive segment within overall video, in seconds
    interactiveScreenStart: 54, //time to display interactive screen
    interactiveTargetImageStart: 54, //time to display activity target image or images
    interactiveButtonStart: 54, //time to display interactive buttons, non-clickable, could also be microphone
    redButtonHighlightStart: 59, //time to display red button highlight
    greenButtonHighlightStart: 58, //time to display green button highlight
    buttonHighlightDuration: 2, //duration for button highlight
    interactivityStart: 60, //time to allow user interactivity, start countdown clock 
    countdownClockStart: 60, //time to display clock countdown, should be same as interactivityStart
    interactivityDuration: 6, //total time for user interactivity, can use instead of countdown duration
    hightlightCorrectAnswerStart: 67, //time to highlight correct answer
    hightlightCorrectAnswerDuration: 5, //duration to highlight correct answer
    activityEnd: 72, //time to end all activity screens
    activityTotalDuration: 18, //total time for activity start to finish, everything included
    activityImages: require('./assets/images/tf/s1_eyes.png'), //image assets, target images, interactive icons, etc.
    correctAnswer: 'green' //correct answer to the activity question//
  },
  {
    activityId: 5,
    activityType: 'trueFalse',
    interactive: true,
    activityStart: 76,
    interactiveScreenStart: 76,
    interactiveTargetImageStart: 76,
    interactiveButtonStart: 76,
    interactivityStart: 83,
    countdownClockStart: 83,
    interactivityDuration: 5,
    hightlightCorrectAnswerStart: 89,
    hightlightCorrectAnswerDuration: 4,
    activityEnd: 93,
    activityImages: require('./assets/images/tf/s1_knee.png'),
    correctAnswer: 'red'
  },
  {
    activityId: 6,
    activityType: 'multipleChoice',
    interactive: true,
    activityStart: 192,
    interactiveScreenStart: 192,
    interactiveTargetImageStart: 192,
    interactivityStart: 195,
    countdownClockStart: 195,
    interactivityDuration: 5,
    hightlightCorrectAnswerStart: 201,
    hightlightCorrectAnswerDuration: 5,
    activityEnd: 206,
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
    activityStart: 207,
    interactiveScreenStart: 207,
    interactiveTargetImageStart: 207,
    interactivityStart: 209,
    countdownClockStart: 209,
    interactivityDuration: 5,
    hightlightCorrectAnswerStart: 216,
    hightlightCorrectAnswerDuration: 2,
    activityEnd: 218,
    activityImages: [ 
      require('./assets/images/mc/body.png'), 
      require('./assets/images/mc/finger.png'), 
      require('./assets/images/mc/feet.png'), 
      require('./assets/images/mc/hand.png')
    ],
    correctAnswer: 3,
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
     }
  }

  componentDidMount() {
    //this.animateSpeechActivityProcessing(5)
    //this.animateSpeechActivityRecording(5);
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
    //console.log('speechScore', speechScore, typeof speechScore)
    //console.log('parseInt(speechScore, 10) >= 0.5', parseInt(speechScore, 10) >= 0.5)
    //console.log('parseInt(speechScore, 10)', parseInt(speechScore, 10))
    if (parseFloat(speechScore, 10) >= 0.5) {
      //console.log('incrementTicketCounter-----')
      this.setState({
        speechActivityCorrectAnswer: true
      });
      this.incrementTicketCounter();
    } else {
      this.setState({
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
      console.log('start interactivity')
      var uniqId = Date.now();
      var uniqAudioPath = AudioUtils.DocumentDirectoryPath + '/' + apiObject.pcmFileName + '-' + uniqId + '.lpcm';
      console.log('AudioUtils.DocumentDirectoryPath', AudioUtils.DocumentDirectoryPath)
      console.log('uniqAudioPath', uniqAudioPath)
      this.setState({
        speechActivityAudioPath: uniqAudioPath
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
    console.log('_prepareRecordingPath audioPath', audioPath)
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
    console.log('iterations', iterations)
    console.log('this.state.speechActivityRecording', this.state.speechActivityRecording)
    //if (this.state.speechActivityRecording) {
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
    //}
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
    //if (!this.state.speechActivityRecording) {
      console.log('_startSpeechActivityRecording')
      this._prepareRecordingPath(speechActivityAudioPath)
      this.setState({
        speechActivityRecording: true
      });
      this.animateSpeechActivityRecording(apiObject.interactivityAnimationDuration)
      
      try {
        const filePath = await AudioRecorder.startRecording();
      } catch (error) {
        console.log(error);
      }
    //}
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
    //console.log('this.state.speechActivityAudioPath', this.state.speechActivityAudioPath)
    formData.append('file', { 
      uri: path,
      name: apiObject.pcmFileName,
      type: 'audio/wav'
    })
    formData.append('ref_text', apiObject.correctAnswer)
    //console.log('formData', formData)

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
      console.log(responseJson)
      this.setState({
        speechActivityScore: responseJson.score,
        speechActivityProcessing: false
      })
      this._checkSpeechActivityAnswer(this.state.speechActivityScore, 'speechActivity')
    })
    .catch((error) => {
      console.log(error)
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
    this.player.seek(122);
  };

    _onPressReloadVideo = () => {
    if(this.player !== null) {
      this.player.seek(0);
      this.setState({
        ticketCounter: 0,
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
        speechActivityCheckmark: false,
        speechActivityImage: null,
        speechActivityRecording: false,
        speechActivityAudioPath: null,
        speechActivityScore: null,
        speechActivityProcessingAnim: new Animated.Value(1),
        multipleChoice: false,
        multipleChoiceAnswer: null,
        multipleChoiceSelected: null,
        multipleChoiceImages: [],
        multipleChoiceCheckmark: false,
        multipleChoiceCorrectAnswer: null,
        countdownClock: false,
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
        // buttonHighlightDuration: 2, //duration for button highlight
        if (Math.round(status.currentTime) === mockAPI.redButtonHighlightStart ) {
          this._onPressTrueFalse('red')
          this.redButtonHighlightTimeout = setTimeout(
            () => {
              this._onPressTrueFalse(null)
            }, mockAPI.buttonHighlightDuration * 1000
          );
        }

        // greenButtonHighlightStart: 9, //time to display green button highlight
        // buttonHighlightDuration: 2, //duration for button highlight
        if (Math.round(status.currentTime) === mockAPI.greenButtonHighlightStart ) {
          this._onPressTrueFalse('green')
          this.greenButtonHighlightTimeout = setTimeout(
            () => {
              this._onPressTrueFalse(null);
            }, mockAPI.buttonHighlightDuration * 1000
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
            style={[styles.video, { width: 668, height: 375 }]}
            source={{ uri: 'https://s3-us-west-1.amazonaws.com/gr-video-assets/180302_Wordplay_Demo_v1.mp4' }}
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
                        {borderColor: 'rgba(15,123,232, 0.7)', borderWidth: 5, position: 'absolute', height: 90, width: 90, borderRadius: 100, opacity: this.state.speechActivityProcessingAnim}
                      }></Animated.View>
                    }

                    {this.state.speechActivityRecording && this.state.countdownClock &&
                       <Animated.View style={[{opacity: this.state.speechActivityRecordingAnim}, styles.speechActivityRecordingLeftOne]}></Animated.View>}
                    {this.state.speechActivityRecording && this.state.countdownClock &&
                       <Animated.View style={[{opacity: this.state.speechActivityRecordingAnim}, styles.speechActivityRecordingLeftTwo]}></Animated.View>}
                    {this.state.speechActivityRecording && this.state.countdownClock &&
                       <Animated.View style={[{opacity: this.state.speechActivityRecordingAnim}, styles.speechActivityRecordingLeftThree]}></Animated.View>}
                     

                      <View style={
                          this.state.speechActivityRecording && this.state.countdownClock ? styles.speechActivityRecordingHighlight : {}
                        }>
                        {!this.state.speechActivityCorrectAnswer && !this.state.speechActivityIncorrectAnswer &&
                          <View>
                           <Image style={styles.speechActivityIcon} source={require('./assets/images/microphone.png')} />
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
    width: 160,
    marginTop: 15,
    borderWidth: 2,
    borderColor: '#898989',
    borderRadius: 15,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  speechActivityImage: {
    height: 125,
    width: 125,
    alignSelf: 'center'
  },
  speechActivityIconContainer: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    marginTop: 15,
    zIndex: 3,
    backgroundColor: '#ffffff',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  speechActivityRecordingHighlight: {
    // borderColor: 'rgba(15,123,232, 1)',
    // borderWidth: 5,
    // borderRadius: 100
  },
  speechActivityIcon: {
    width: 50,
    height: 50
  },
  speechActivityRecordingLeftOne: {
    top: 40, 
    left: 15, 
    backgroundColor: 'rgb(15,123,232)', 
    height: 10, 
    width: 3, 
    position: 'absolute'
  },
  speechActivityRecordingLeftTwo: {
    top: 35, 
    left: 20, 
    backgroundColor: 'rgb(15,123,232)', 
    height: 20, 
    width: 3, 
    position: 'absolute'
  },
  speechActivityRecordingLeftThree: {
    top: 30, 
    left: 25, 
    backgroundColor: 'rgb(15,123,232)', 
    height: 30, 
    width: 3, 
    position: 'absolute'
  },
  speechActivityRecordingRightOne: {
    top: 40, 
    right: 15, 
    backgroundColor: 'rgb(15,123,232)', 
    height: 10, 
    width: 3, 
    position: 'absolute'
  },
  speechActivityRecordingRightTwo: {
    top: 35, 
    right: 20, 
    backgroundColor: 'rgb(15,123,232)', 
    height: 20, 
    width: 3, 
    position: 'absolute'
  },
  speechActivityRecordingRightThree: {
    top: 30, 
    right: 25, 
    backgroundColor: 'rgb(15,123,232)', 
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
