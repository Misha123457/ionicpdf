import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.scss'],
})
export class FileuploadComponent  implements OnInit {
  @Output() pdflinkCreated = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {}

  onFileSelected(event:any) {
    
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
      this.pdflinkCreated.emit(img.src);
    };
  }

}
