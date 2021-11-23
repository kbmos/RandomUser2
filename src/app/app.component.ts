// Import the core angular services.
import { Component } from "@angular/core";
import { HttpClient } from '@angular/common/http';
// Import the application components and services.
import { descriptions } from "./dictionaries/descriptions";
import { things } from "./dictionaries/things";
import { ThrowStmt } from "@angular/compiler";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Component({
	selector: "app-root",
	styleUrls: [ "./app.component.less" ],
	templateUrl: "./app.component.html"
})
export class AppComponent {
  public isLoading: boolean;
	public descriptionIndex: number;
	public descriptions: string[];
	public sprintName: string;
	public thingIndex: number;
	public things: string[];
	public data_server:any;
  public switchChange:boolean;
	test: string = "";
  public Displacement:number;
  public descriptionIndex_before:number;
  // myimg: string="../assets/christmas-5709552.svg";
  public gotItemIndex: number[]=[];

	// I initialize the app component.
	constructor(protected http: HttpClient) {
    this.Displacement=0;
    this.isLoading=false;
		this.descriptionIndex = 0;
		this.descriptions = descriptions;
		this.sprintName = "";
		this.thingIndex = 0;
		this.things = things;
    this.switchChange=false;
    this.descriptionIndex_before=0;
		// this.generateName();
    // var gotItemIndex =new Array();

	}


  ngOnInit() {

    this.http.get(`http://192.0.0.46:8095/api/employee/employeelist`, {}).subscribe((res:any) =>{
    const data:any = res;
	this.data_server = data;
	console.log("Success",this.data_server);
  this.descriptions.push("")
  this.things.push("");
    for(var y=0;y<2;y++){
        for(var x=0 ;x< data.length;x++)
        {
          // if(x==0){ //เริ่มครั้งแรกให้ใส่ค่าว่าง
          //   this.descriptions[x]="";
          //   this.things[x] = "";
          // }
          // else{
            this.descriptions.push(" "+data[x]['name']+" "+data[x]['surname']);
            if(data[x]['depT_CODE']=="00")
            {
              this.things.push ("สำนักงานใหญ่");

              // console.log(data.length);
            }
            else if(data[x]['depT_CODE']=="01")
              this.things.push("บริหาร");
            else
              this.things.push(data[x]['depT_CODE']);
          // }
          // var user_Data = data[0]['name'];
          // console.log("Success",data[3]['name'],data[3]['depT_CODE']);

          // this.descriptions

          }
       }
          console.log("All data:",this.descriptions);


   });
  }

	// ---
	// PUBLIC METHODS.
	// ---

	// I generate the next Sprint Name by randomly selecting a Description and a Thing
	// and then joining the two values.
	public generateName() : void {
    setTimeout(() => {
      this.playAudio();
    }, 500)

    console.log("this.isLoading = true");
    this.isLoading = true;
    this.descriptionIndex_before=this.descriptionIndex; //เก็บค่าตัว current index ก่อนมันเปลี่ยนค่าไปค่าที่ random ได้
		this.descriptionIndex = this.nextIndex( this.descriptionIndex, this.descriptions ); //สุ่มหาตัวเลขที่แรนด้อมถัดไป
    console.log("descriptionIndex After return func:",this.descriptionIndex);
    // this.descriptionIndex=1;
    this.Displacement= this.descriptionIndex-this.descriptionIndex_before; //หาค่ากระจัดระหว่างระยะห่างอันแรก กับ อันที่แรนด้อมได้ใหม่่
    this.Displacement=Math.abs(this.Displacement);

    console.log("Displacement= "+this.Displacement+" descriptionIndex :"+(this.descriptionIndex)+" descriptionIndex_before: "+this.descriptionIndex_before+" Now this.switchChange = "+this.switchChange);

    if( this.Displacement< 500 && this.switchChange==false){
      console.log("descriptionIndex < 200 then change to :",this.descriptionIndex+this.data_server.length+ "switchChange= true ");
      this.descriptionIndex+=this.data_server.length;
      this.switchChange=true;
      // this.descriptionIndex+= this.descriptions.length;
      // console.log("");
    }
    else if( this.Displacement< 500 && this.switchChange==true){
      console.log("descriptionIndex < 200 then change to :",this.descriptionIndex-this.data_server.length+"switchChange= false ");
      this.descriptionIndex=this.descriptionIndex-this.data_server.length;
      console.log("descriptionIndex LastChange : ",this.descriptionIndex);
      this.switchChange=false;
      // this.descriptionIndex+= this.descriptions.length;
      // console.log("");
    }
    this.thingIndex = 	this.descriptionIndex;


    // console.log("Description length : "+this.descriptions.length," things length :"+this.things.length);

    // if(this.gotItemIndex.find(e => e === this.descriptionIndex)){
		// console.log("1");
    //   this.descriptionIndex++;
    //   this.thingIndex++;
    // }
    if(this.descriptionIndex>this.data_server.length)
      this.gotItemIndex.push(this.descriptionIndex-this.data_server.length-1);
    else
      this.gotItemIndex.push(this.descriptionIndex-1);

    console.log(this.gotItemIndex);
		this.sprintName = (
			this.descriptions[ this.descriptionIndex ] +
			" " +
			this.things[ this.thingIndex ]

		);
		this.shareSprintNameWithUser( this.sprintName ); //แสดง data ใน Log
    setTimeout(() => {
      console.log("Waiting")
      this.isLoading=false;
      this.playAudio_End();
    }, 1000)
    console.log("this.isLoading = false");


	}

  public playAudio(){
    let audio = new Audio();
    audio.src = "../assets/sounds/slot-machine-sound-effect (2).mp3";
    audio.load();
    audio.play();
  }
  public playAudio_End(){
    let audio = new Audio();
    audio.src = "../assets/sounds/mixkit-coin-win.wav";
    audio.load();
    audio.play();
  }


	// public generate2() : void {
	// 	for(var x=0 ;x< this.data_loop.length;x++) {
	// 		this.test = this.data_loop[x].name;
	// 		this.delay(300);
	// 		console.log(this.test);
	// 	}
	// }

	// ---
	// PRIVATE METHODS.
	// ---

	// I try to copy the value to the user's clipboard. Returns Boolean indicating
	// whether or not the operation appeared to be successful.
	private copyToClipboard( value: string ) : boolean {

		// In order to execute the "Copy" command, we actually have to have a "selection"
		// in the rendered document. As such, we're going to inject a Textarea element,
		// populate it with the given value, select it, and then copy it. Since this
		// operation is going to change the document selection, let's get a reference to
		// the currently-active element (expected to be our "Generate" button) such that
		// we can return focus after the copy command has executed.
		var activeElement = <HTMLElement | null>document.activeElement;

		var textarea: HTMLTextAreaElement = document.createElement( "textarea" );
		textarea.style.opacity = "0";
		textarea.style.position = "fixed";
		//console.log("VALUE : ",value);
		textarea.value = value;
		// Set and select the value (creating an active Selection range).
		document.body.appendChild( textarea );
		textarea.select();

		try {

			// CAUTION: Even though this may not throw an error, the COPY command does
			// not appear to work unless it is in response to a direct user interaction.
			// Meaning, nothing gets copied until the user actually CLICKS the button to
			// generate a new name. Not sure why that is? Maybe a security issue?
			document.execCommand( "copy" );
			return( true );

		} catch ( error ) {

			return( false );

		} finally {

			// Return focus to the active element, if we had one.
			if ( activeElement ) {

				activeElement.focus();

			}

			document.body.removeChild( textarea );

		}

	}


	// I return a random index for selection within the given collection.
	private nextIndex( currentIndex: number, collection: any[] ) : number {
		console.log("Current Index",currentIndex)
		var nextIndex = currentIndex;
		var length = this.data_server.length;
    // // var length = collection.length;
    // console.log(length);

		// Keep generating a random index until we get a non-matching value. This just
		// ensures some "change" from generation to generation.
		while ( nextIndex === currentIndex ) { //หมุนไปหาค่าที่กำหนด
			// console.log("Loop.........................");
			nextIndex = ( Math.floor( Math.random() * length ) );
      console.log("User Index win : ",nextIndex);
      if(nextIndex==0){
        nextIndex=1;
      }
      else if(this.switchChange==true){
        nextIndex+=(this.data_server.length);
        console.log("Real Current Index: "+nextIndex);
      }


		}

		return( nextIndex );

	}


	// I share the given Sprint Name with the user.
	private shareSprintNameWithUser( sprintName: string ) : void {

		// As a convenience, try to copy the new name to the user's clipboard.
		var nameWasCopied = this.copyToClipboard( sprintName );

		// Also, let's log the name to the user's console.
		console.group(
			"%c Sprint Name Generator ",
			"background-color: #121212 ; color: #ffffff ;"
		);
		console.log(
			`%c${ sprintName }`,
			"color: #ff3366 ;"
		);
		if ( nameWasCopied ) {

			console.log(
				"%cThis name was copied to your clipboard.",
				"font-style: italic ;"
			);

		}
		console.groupEnd();

	}

}
