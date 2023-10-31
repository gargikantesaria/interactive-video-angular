import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import videojs from 'video.js';
import 'videojs-overlay';

@Component({
  selector: 'app-view-video-with-interaction',
  templateUrl: './view-video-with-interaction.component.html',
  styleUrls: ['./view-video-with-interaction.component.scss']
})
export class ViewVideoWithInteractionComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('videoPlayer') private videoPlayerRef: ElementRef;
  private player: any;

  // interactions = [
  //   { timestamp: 3, description: 'This is description text' },
  //   { timestamp: 10, description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English.\nIt is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English.' },
  //   { timestamp: 180, description: 'Again description text' }
  // ];

  interactions = [];
  uploadedVideoFileInfo: { fileURL: string, fileType: string };

  constructor(private router: Router) {
    const getInteractionArrayFromStorage = JSON.parse(localStorage.getItem('interactionArray'));
    if (getInteractionArrayFromStorage && getInteractionArrayFromStorage.length > 0) {
      this.interactions = JSON.parse(localStorage.getItem('interactionArray'));
    }

    const getUploadedFileFromStorage = JSON.parse(localStorage.getItem('selectedVideoFileInfo'));
    if (getUploadedFileFromStorage) {
      this.uploadedVideoFileInfo = getUploadedFileFromStorage;
    }

    console.log(this.interactions);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }

  ngAfterViewInit(): void {
    this.initializePlayer();
  }

  // handleFileInput(event: any): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.loadVideo(file);
  //   }
  // }

  private initializePlayer(): void {
    this.player = videojs(this.videoPlayerRef.nativeElement, {
      controls: true
    });
    if (this.player) {
      this.player.pause();
      // this.player.src('https://media.vimejs.com/720p.mp4');
      this.player.src({ type: this.uploadedVideoFileInfo.fileType, src: this.uploadedVideoFileInfo.fileURL });
      this.player.load();
      this.player.play();
    }

    this.setupInteractions();

    // getting called everytime when video seeked means forward, backward or reply video
    this.player.on('seeked', () => {
      console.log('video seeked');
      this.pauseVideoAtTimeStamp();
    });
  }

  // private loadVideo(file: File): void {
  //   if (this.player) { 
  //     this.player.pause();
  //     // if we do upload locally then give src like below, otherwise give direct url in src
  //     this.player.src({ type: file.type, src: URL.createObjectURL(file) });
  //     this.player.load();
  //     this.player.play();
  //   }
  // }

  setupInteractions(): void {
    let overlaysArray = [];
    this.interactions.forEach(interaction => {
      let overlayObject = {
        content: this.createOverlayContent(interaction),
        start: interaction.timestamp,
        end: interaction.timestamp + 0.3,
      };

      overlaysArray.push(overlayObject);
    });

    this.player.ready(() => {
      const overlay = this.player.overlay({
        content: 'default',
        debug: true,
        class: 'interaction-overlay',
        overlays: overlaysArray,
      });
    });

    // pause video at timestamps
    this.pauseVideoAtTimeStamp();
  }

  pauseVideoAtTimeStamp() {
    const timestampsToPause = this.interactions.map(interaction => interaction.timestamp);
    const pausedAtTimestamp: { [timestamp: number]: boolean } = {};

    this.player.on('timeupdate', () => {
      const currentTime = this.player.currentTime();
      const currentSecond = Math.floor(currentTime);
      if (timestampsToPause.includes(currentSecond) && !pausedAtTimestamp[currentSecond]) {
        this.player.pause();
        pausedAtTimestamp[currentSecond] = true;
      }
    });
  }

  createOverlayContent(interaction: any): HTMLElement {
    const overlay = document.createElement('div');
    overlay.className = 'video-overlay';
    overlay.innerHTML = `
      <div class="overlay-description">${interaction.content}</div>
      <button class="okay-overlay-button">Okay!</button>
    `;

    // Get the okay button element and add a click event listener
    const button = overlay.querySelector('.okay-overlay-button');
    if (button) {
      button.addEventListener('click', () => {
        console.log('okay button clicked from overlay');
        this.player.play();
      });
    }

    return overlay;
  }

  onBack() {
    this.router.navigate(['add-video-interaction']);
  }
}
