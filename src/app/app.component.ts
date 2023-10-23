import { Component, ViewChild, ElementRef, OnInit, AfterContentInit, HostListener  } from '@angular/core';
import { fabric } from "fabric-with-gestures";
import { NgxSignaturePadComponent, NgxSignatureOptions } from '@eve-sama/ngx-signature-pad';
import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import SignaturePad from 'signature_pad';

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
  
  @ViewChild('canvas', { static: true }) signaturePadElement:any;
  signaturePad: any;
  canvasWidth: number;
  canvasHeight: number;


  
  @ViewChild('pdfcanvas', { static: true }) pdfcanvas: ElementRef<HTMLCanvasElement> ;
  ctx: CanvasRenderingContext2D| null;
  @ViewChild('signature') signature: NgxSignaturePadComponent;
  

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

  constructor(private router: Router, private elementRef: ElementRef) { }

  onBeginSign(): void { }
  onEndSign(): void { }

  saveSignature() {

    this.signaturePad.backgroundColor="rgba(255,255,255,0)";
    const signlinkoncanvas = this.signaturePad.toDataURL("image/png"); // Получаем данные изображения в base64
    
    //const signlinkoncanvas=this.signaturePad.toSVG({includeBackgroundColor: false})
    this.imagelink=signlinkoncanvas;
    console.log("check",this.imagelink)
    this.loadPDFwithsignature();

    this.signaturePad.backgroundColor="rgba(255,255,255,0)"
   
  }

  ngOnInit() {
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
    if (this.signaturePad) {
      this.signaturePad.clear(); // Clear the pad on init
    }

    //this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx = this.pdfcanvas.nativeElement.getContext('2d');
    this.fabrikcanvas = new fabric.Canvas("pdfcanvas");

    //this.signaturePad.penColor = 'rgb(56,128,255)';

  }
       
  public ngAfterViewInit(): void {
    this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
    this.signaturePad.clear();
    this.signaturePad.penColor = 'rgb(56,128,255)';
    //this.signaturePad.backgroundColor="rgb(0,255,255)";
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


    // Prepare canvas using PDF page dimensions
    // var canvas: any = document.getElementById('the-canvas');
    // var context = canvas.getContext('2d');
    //that.pdfcanvas.nativeElement.height = document.documentElement.scrollHeight;
    //that.pdfcanvas.nativeElement.width = document.documentElement.scrollWidth;

        //signaturecanvas.width = window.innerWidth;
    //console.log("proveryazu",window.innerWidth)
    //signaturecanvas.height = window.innerHeight;

    //that.pdfcanvas.nativeElement.width=window.innerWidth;
    //that.pdfcanvas.nativeElement.height= window.innerHeight;

    //viewport.width = document.documentElement.scrollWidth;
    //viewport.height = document.documentElement.scrollHeight;
    console.log("height pdf canvas height",that.pdfcanvas.nativeElement.height)
    console.log("viewpoer.width",viewport.width)
    console.log("viewpoer.width",viewport.height)
    // Render PDF page into canvas context
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

  loadPDFwithsignature() {

    const loadingTask = pdfjsLib.getDocument( this.pdfurl );

  

    //let that = this;

    loadingTask.promise.then((pdf) => {
      console.log( "pdf: ", pdf );
      console.log('PDF loaded');

  // Fetch the first page
      var pageNumber = 1;
      pdf.getPage(pageNumber).then((page)=> {
        console.log('Page loaded');

        var scale = 1;
        var viewport = page.getViewport({scale: scale});

      // Prepare canvas using PDF page dimensions
      // var canvas: any = document.getElementById('the-canvas');
      // var context = canvas.getContext('2d');
        console.log("height pdf canvas height after sign",this.pdfcanvas.nativeElement.height)
        this.pdfcanvas.nativeElement.height =  window.innerHeight+300;
        this.pdfcanvas.nativeElement.width =  window.innerWidth+300;
        console.log("viewpoer after upload.width",document.documentElement.scrollWidth)
        console.log("viewpoer after upload.height",document.documentElement.scrollHeight)
     //   viewport.width = window.innerWidth;
      //  viewport.height = window.innerHeight

      // Render PDF page into canvas context
        var renderContext:any = {
          canvasContext: this.ctx,
          viewport: viewport
        };
        var renderTask = page.render(renderContext);
        renderTask.promise.then(() => {
          console.log('Page rendered ');
          this.loadsignature(this.pdfcanvas.nativeElement);
        });
      });
    });
  }

  
loadsignature(canvas:HTMLCanvasElement){

        //fcanvas.discardActiveObject();
        
  var bg =canvas.toDataURL();
  //this.fabrikcanvas = new fabric.Canvas("canvas");
  console.log("renderer")
  //this.fabrikcanvas=fcanvas
  this.fabrikcanvas.setBackgroundImage(bg,this.fabrikcanvas.renderAll.bind(this.fabrikcanvas));
  console.log("link to draw!!!", this.imagelink)
  //var link = this.signaturePadElement.toDataURL("image/jpeg")
  //var link= "data:image/jpeg;base64,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"
  //this.fabrikcanvas.setWidth( document.documentElement.scrollWidth);
  //this.fabrikcanvas.setHeight( document.documentElement.scrollHeight);

  //this.fabrikcanvas.setHeight(window.innerHeight);
  //this.fabrikcanvas.setWidth(window.innerWidth);
  //this.getLink().then((link)=> {
  fabric.Image.fromURL(this.imagelink, (img:any) => {

      this.img=img
      console.log("img",this.img)
      //this.img.scaleToHeight(250);
      //this.img.scaleToWidth(250);
      this.img.set({ selectable: true });
      this.fabrikcanvas.add(this.img);


    });

  //}).catch((error) => {
    // Обработка ошибок, если не удалось получить link
  //  console.error(error);
  //});

  this.fabrikcanvas.renderAll()

}

getLink(): Promise<string> {
  return new Promise<string>((resolve) => {
    // Ваш код получения link

    var canvas = this.signature.toDataURL("image/jpeg"); // Получаем данные изображения в base64
    //const linka = document.createElement('a');
    //linka.href = canvas;
    console.log("Attention",canvas)
    
    //this.imagelink=canvas;
    resolve(canvas);
  });
}

onpdflinkCreated(linka: string) {

//this.ctx = canvas.getContext('2d');
console.log("fdffffffffffffff", linka);
this.pdfurl=linka
this.startPDF();

// Получаем доступ к элементу Canvas, переданному из дочернего компонента
}

saveAsPDF() {
//const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;

const imgData = this.pdfcanvas.nativeElement.toDataURL('image/png');

const pdf = new jsPDF();
var width = pdf.internal.pageSize.getWidth();
var height = pdf.internal.pageSize.getHeight();
pdf.addImage(imgData, 'png', 0, 0, width, height);
pdf.save('C:\Users\Mikha\OneDrive\Документы\canvas.pdf');
//saveAs(pdf.output('blob'));
}

undo() {
  const data = this.signaturePad.toData();
  if (data) {
    data.pop(); // remove the last dot or line
    this.signaturePad.fromData(data);
  }
}

  ClearSignature(){
 
      this.signaturePad.clear();
      this.signaturePad.backgroundColor="rgba(255,255,255,0)"
      //this.signature.clear();
      //this.img.remove()
      this.fabrikcanvas.remove(this.img)
     // this.fabrikcanvas.add(this.img)
      //this.reloadPage();
     // this.startPDF()
      this.fabrikcanvas.clear()
      this.startPDF()
       //this.canvas.nativeElement.reset();

      //this.imagelink="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCABkAMgDASIAAhEBAxEB/8QAGwABAAIDAQEAAAAAAAAAAAAAAAcJBQYIBAP/xAAsEAABAwMEAQMEAgMBAAAAAAAAAQIDBAUHBggREiEJEzEUIkFRMmEVQnGC/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ALUwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPHeLxaNPWmsv1/utHbLZboH1VZW1k7YYKaFjVc+SSR6o1jGtRVVyqiIiKqgewHD24T1aNvOJY2W3Giuyfe5O3ZlrqfYoKdE8J7lU5jkcqr8JG1/hF5VvLeeV6Tej6l+7u4Podv+ipdP2WaVYFqbFaWJTxpz8TXGs7MY9P2x0arwvCfgC3q+X6xaZtc971JeqC026lb3nrK6pZBBE39ue9Ua1P+qcqZR9UnabjyrfZbBqa5ZAvPb2o6LSlEtUx8i+GtSoerIXoq/mN71/pV4RYjxv6V+psg1kGtt7Wc9S68u6oj0stJdZ5KeBeeej6qbl7m8KqdImxI1fh7kO08VbesIYQpG0uKcX6f045Ge26ppaRq1crf1JUv5mk/wDT1A5YbuC9QvcOyGjwjtupMS2Ktd0dqbW9T3qIo3IqpNHSvYx/xxxxDM1fHnheSKqbU25Lb5v6xRh7Vm6a/ZUpdUIk17tXs/Tx0v1ET43JJB2cxGNWNJ2KiorWtX7U7Kr7Bs1Zi0XgXG14yfr24MprXaYuyM9xrZKqZf4QRI5U7SOXwjU8/K8eCvj0vsfapznm/IO+XJVGrJ6+uqaSx8I321qJ0VKjp456Qw+3C1yfPd6LyqKBaAAAAAAAAAAAAAAAAAAAAAAAAAYTWui9K5G0nddC63slPd7Fe6V9HX0VQi9JonJ5TlFRzVTwqOaqOa5Ec1UVEUzYAhfTey7aXpSiiobTt0x/IyFrWsfX2KCum+34VZahr3qvn5V3K+OV8ITHS0tNRU8VHR08UEELEZHFExGsY1PCI1E8IifpD6gAQXuX3mYP2tWWebX2pI6rUK06T0OmqB7ZLjVo53Vq9OeImc8qr5FanDXdezkRqzocM1/pH4H1XlHVeTMj631nqJ2pLvU3VtvSqjp44VnkWRzJJUa6WXhXKiORzPHyir5ArJ3Bbx9S7pspQatzLSXCXRtpkdJatH2qv+ngib4RGLM5ruHv+ZJ/bc9UTq1GIrenRmgdyHqM7lLNRaQ2qY0t2gdFWaNtLTt03a4KKghiY7lrFrK1Vb2Tjy2FWq7zy1eyouqZt2W5t2d5qumRMZ4Pocl48hmkfaP8raEv1PBBI1Hdaulb97XRLy1JXNRq8IvPLuDpfb/6xOIKyitmjsxY5qdAy00bKRtVZIUntMCNXqieynEsDEThEa1snHHyiAWA44otaW3H2mrdke60lz1VTWmkhvdbSM6Q1Fc2JqTyMThPtV6OX4bzzz1b/FNjMNo/WWlMgaaodY6H1Fbr7Y7nGslJcLfUNngmajla7q9qqnLXNc1U+Uc1UXhUVDMgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhzOe0nAm4OwXO1a9x3ZnXG4t7NvlLSMguUEyIqMkSoYiSO6qvPRyqx3w5FQmMAUtXqn3OekhldH2W4O1Xi3UtS6SGOZXMoblwiIrZG+fpa1rEb97eezUThXtRWttO26bmsT7ntExaxxpf4ppWMalytMz0bXW2VU8smj55ROeer05Y7heqrwvG55ExxofLOkLhoLIum6O+2G6R+3U0dU3lq/pzVThzHtXy17VRzVRFRUUrp1h6VuXMI64iyzsizPNbLnSPc6O2Xqb2pmxL5WFtQ1joqhiqjU9qeNrVRPuc5UAs6BXBafUe3E7d75TaR3z7dq+2U0rkii1Lp+FEjkVPz17up6hfy72pmK1P9F5RDtDCm5nBe4iimq8Q5Ftt+lpYmzVVE3vDWUzVXjtJTyo2RrefHbr1VfhVAk8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHlulqtd7t89pvVtpbhQ1TOk9NVQtlilb+nMcio5P6VDS8f4Cwrii/XPU2M8X6c0vcrxE2GtmtNAym92NruyM6sRGtbz54aiIqonPwhvwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//2Q=="

      //this.ctx = this.canvas.nativeElement.getContext('2d')
      
  }

  reloadPage() {
    console.log("reloading?",this.router.url)
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([this.router.url]);
    });
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
