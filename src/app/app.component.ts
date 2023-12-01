import { Component, ViewChild, ElementRef, OnInit, AfterContentInit, HostListener  } from '@angular/core';
import { fabric } from "fabric-with-gestures";
import { NgxSignaturePadComponent, NgxSignatureOptions } from '@eve-sama/ngx-signature-pad';
import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import SignaturePad from 'signature_pad';
import { IonicStorageModule } from '@ionic/storage-angular';``
import { Storage } from '@ionic/storage-angular';


if( pdfjsLib !== undefined ){
  console.log( "set worker...");
   pdfjsLib.GlobalWorkerOptions.workerSrc = "https://npmcdn.com/pdfjs-dist@3.3.122/build/pdf.worker.js";
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {
  points = [];
  signatureImage:any;
  name = 'Angular';
  imagelink:any;
  fabrikcanvas:any;
  img:any;
  

  
  @ViewChild('pdfcanvas', { static: true }) pdfcanvas: ElementRef<HTMLCanvasElement> ;
  ctx: CanvasRenderingContext2D| null;
  
  

  public options: NgxSignatureOptions = {
    backgroundColor: '#FFFFFF',
    width: 200,
    height: 400,
    
    
    css: {
      'border-radius': '16px',
      'display':'block',
      'top':'300',
      'backgroundcolor':'rgba(0,0,0,0)',
    }
    
    
  };

  pdfurl = encodeURI("https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf");

  constructor(private router: Router, private elementRef: ElementRef, private storage: Storage) { }

  onBeginSign(): void { }
  onEndSign(): void { }

  

  async ngOnInit() {
        
    this.init()

   
  }

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.init();
  }

  init() {
    const signaturecanvas: any = this.elementRef.nativeElement.querySelector('canvas');
    signaturecanvas.width = window.innerWidth;
    //console.log("proveryazu",window.innerWidth)
    signaturecanvas.height = window.innerHeight;

    //this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx = this.pdfcanvas.nativeElement.getContext('2d');
    this.fabrikcanvas = new fabric.Canvas("pdfcanvas");


  }
       
 
  startPDF() {
  
    const loadingTask = pdfjsLib.getDocument( this.pdfurl );
    let that = this;
    console.log("Scroll width",document.documentElement.scrollWidth,window.innerWidth)
    //this.fabrikcanvas.setWidth(document.documentElement.scrollWidth+200);
    this.fabrikcanvas.setHeight(window.innerHeight+300);

    this.fabrikcanvas.setWidth(window.innerWidth+300)

    loadingTask.promise.then((pdf) => {
      console.log( "pdf: ", pdf );
       console.log('PDF loaded');

  // Fetch the first page
    var pageNumber = 1;
    pdf.getPage(pageNumber).then(function(page) {
    console.log('Page loaded');

    var scale = 1;
    var viewport = page.getViewport({scale: scale});
    var renderContext:any = {
      canvasContext: that.ctx,
      viewport: viewport
    };
    var renderTask = page.render(renderContext);
    renderTask.promise.then(() => {
      console.log('Page rendered ');
    });
  });
    });
  }

  
  


getLink(): Promise<string> {
  return new Promise<string>((resolve) => {
    // Ваш код получения link
    
    //this.imagelink=canvas;
    
  });
}

onpdflinkCreated(linka: string) {

//this.ctx = canvas.getContext('2d');
console.log("fdffffffffffffff", linka);
this.pdfurl=linka
this.startPDF();

// Получаем доступ к элементу Canvas, переданному из дочернего компонента
}



  
  onFileSelected(event:any) {
    
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
      //this.pdflinkCreated.emit(img.src);
    };
  }


}
