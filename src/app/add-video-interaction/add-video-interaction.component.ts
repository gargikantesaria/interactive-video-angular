import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import videojs from 'video.js';
import { NotificationService } from '../shared/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-video-interaction',
  templateUrl: './add-video-interaction.component.html',
  styleUrls: ['./add-video-interaction.component.scss']
})
export class AddVideoInteractionComponent implements OnDestroy, AfterViewInit {
  @ViewChild('videoPlayer') private videoPlayerRef: ElementRef;
  player: videojs.Player;
  isPlayerLoaded: boolean = false;
  addParagraphForm: FormGroup;
  isAddParagraphMode: boolean = false;
  interactionArray: {
    timestamp: number,
    content_type: string,
    content: string
  }[] = [];

  uploadedVideoFileInfo: { fileURL: string, fileType: string };

  constructor(private notificationService: NotificationService, private router: Router) {
    this.addParagraphForm = new FormGroup({
      'description': new FormControl(null, Validators.required)
    });

    const getInteractionArrayFromStorage = JSON.parse(localStorage.getItem('interactionArray'));
    if (getInteractionArrayFromStorage && getInteractionArrayFromStorage.length > 0) {
      this.interactionArray = JSON.parse(localStorage.getItem('interactionArray'));
    }

    const getUploadedFileFromStorage = JSON.parse(localStorage.getItem('selectedVideoFileInfo'));
    if (getUploadedFileFromStorage) {
      this.uploadedVideoFileInfo = getUploadedFileFromStorage;
    }
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }

  ngAfterViewInit(): void {
    this.initializePlayer();
  }

  private initializePlayer(): void {
    this.player = videojs(this.videoPlayerRef.nativeElement, {
      controls: true,
    });

    // NOTE: Remove this because currently using local storage so required while navigating back to this page
    if (this.player && this.uploadedVideoFileInfo) {
      this.loadVideo();
    }

    // if (this.player) {
    //   this.player.pause();
    //   this.player.src('https://media.vimejs.com/720p.mp4');
    //   this.player.load();
    //   this.player.play();
    // }

    // enable add paragraph button only if player has been loaded
    this.player.on('loadedmetadata', () => {
      console.log('player has been loaded');
      this.isPlayerLoaded = true;
    });

    // click on play remove the add mode
    this.player.on('play', () => {
      console.log('play button has been clicked.');
      this.resetParagraphMode();
    });
  }

  // handle upload video file
  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadedVideoFileInfo = {
        fileURL: URL.createObjectURL(file),
        fileType: file.type
      };
      this.loadVideo();
    }
  }

  // load uploaded video into video.js player
  loadVideo() {
    if (this.player) {
      this.player.pause();
      // if we do upload locally then give src like below, otherwise give direct url in src
      this.player.src({ type: this.uploadedVideoFileInfo.fileType, src: this.uploadedVideoFileInfo.fileURL });
      this.player.load();
      // this.player.play();
    }
  }

  // click add paragraph
  onAddParagraph() {
    this.player.pause();
    this.isAddParagraphMode = true;
  }

  // on submit paragraph
  onSubmitParagraph() {
    const currentTime = Math.floor(this.player.currentTime());

    // check interaction already exist with timestamp or not
    const existingInteraction = this.interactionArray.find(
      interaction => interaction.timestamp === currentTime
    );

    if (existingInteraction) {
      this.notificationService.showToast('Interaction with the same timestamp already exists!', 'error');
      this.resetParagraphMode();
    } else {
      console.log('paragraph submitted');
      let addParagraphObj = {
        content_type: 'description',
        content: this.addParagraphForm.get('description').value,
        timestamp: currentTime
      };

      this.interactionArray.push(addParagraphObj);
      console.log(this.interactionArray);

      this.notificationService.showToast('Interaction added successfully!', 'success');

      this.resetParagraphMode();
      this.player.play();
    }
  }

  resetParagraphMode() {
    this.isAddParagraphMode = false;
    this.addParagraphForm.reset();
  }

  onPreviewWithInteraction() {
    localStorage.setItem('interactionArray', JSON.stringify(this.interactionArray));
    localStorage.setItem('selectedVideoFileInfo', JSON.stringify(this.uploadedVideoFileInfo));
    this.router.navigate(['view-video']);
  }
}
