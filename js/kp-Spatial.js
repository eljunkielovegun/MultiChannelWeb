let speakPos= [];
let counter =0;


var Octophonic ={
    fL: speakPos[0],
    fR: speakPos[1],
    fSL: speakPos[2],
    fSR: speakPos[3],
    bSL: speakPos[4],
    bSR: speakPos[5],
    bL: speakPos[6],
    bR: speakPos[7]

}

function findPosition8Chan(){
    //let speakPos= [];
    let degree = .78539;
    let offset = .78539/2; //for octophonic
    for(i=0; i<8;i++){
    
        var r = 20;
        var x = r* Math.cos(degree*i+offset);
        var z = r* Math.sin(degree*i+offset);
        var y = 0;
        var tempArr= [x,y,z];
        speakPos.push(tempArr);
    
    }
 //console.log(speakPos);
}

function createSourceMesh(name_, pos_){

    
   name_.position.x = pos_[0];
   name_.position.y = pos_[1];
   name_.position.z = pos_[2];
    //Console.log(pos_)
};



//******************************** */
//create loop for Speaker Representation to make 8 objects
//******************************** */

//Panners
var frontL_P, frontR_P, sFrontL_P,sFrontR_P, sBackL_P, sBackR_P, backL_P,BackR_P;
var panObj = [ frontL_P, frontR_P, sFrontL_P,sFrontR_P, sBackL_P, sBackR_P, backL_P,BackR_P]
//Meters--- to get raw amp val
var frontL_M, frontR_M, sFrontL_M,sFrontR_M, sBackL_M, sBackR_M, backL_M,BackR_M;
var metObj = [frontL_M, frontR_M, sFrontL_M,sFrontR_M, sBackL_M, sBackR_M, backL_M,BackR_M]

// Player and sources
var frontL_S, frontR_S, sFrontL_S,sFrontR_S, sBackL_S, sBackR_S, backL_S,BackR_S;
var srcObj = [frontL_S, frontR_S, sFrontL_S,sFrontR_S, sBackL_S, sBackR_S, backL_S,BackR_S];
//var srcLoc = [ "resources/1.ogg","resources/2.ogg","resources/3.ogg","resources/4.ogg", "resources/5.ogg", "resources/6.ogg", "resources/7.ogg", "resources/8.ogg"];
var srcLoc = [ "resources/shortFilesForTesting/1.wav","resources/shortFilesForTesting/2.wav","resources/shortFilesForTesting/3.wav","resources/shortFilesForTesting/4.wav", "resources/shortFilesForTesting/5.wav", "resources/shortFilesForTesting/6.wav", "resources/shortFilesForTesting/7.wav", "resources/shortFilesForTesting/8.wav"];

var frontL_B, frontR_B, sFrontL_B,sFrontR_B, sBackL_B, sBackR_B, backL_B,BackR_B;
var srcBuf = [frontL_B, frontR_B, sFrontL_B,sFrontR_B, sBackL_B, sBackR_B, backL_B,BackR_B];
//for Speaker represnentation
var frontL, frontR, sFrontL,sFrontR, sBackL, sBackR, backL,BackR;
var posRep = [frontL, frontR, sFrontL,sFrontR,sBackL, sBackR, backL,BackR];
var frontL_L, frontR_L, sFrontL_L,sFrontR_L, sBackL_L, sBackR_L, backL_L,BackR_L;
var posLight = [frontL_L, frontR_L, sFrontL_L,sFrontR_L, sBackL_L, sBackR_L, backL_L,BackR_L];

function createReps(i){
    //for (i=0; i <8; i++) {
        posRep[i] = new THREE.Mesh(
            new THREE.SphereGeometry(5, 20, 20),
            new THREE.MeshLambertMaterial({ 
                
                color :  0xffffff , 
                wireframe : false 
            })
        );

                var sphere = new THREE.SphereBufferGeometry( 0.5, 16, 8 );
				//lights
				posLight[i] = new THREE.PointLight( 0xff0040, 1, 1000 );
                // posLight[i].add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { 
                    
                //     color: 0xff0040,
                //     transparent: true,
                //     opacity: 1,
                //     wireframe: true
                
                // } ) ) );
                posLight[i].position.x = speakPos[i][0]*.6;
                posLight[i].position.y = speakPos[i][1]*.6;
                posLight[i].position.z = speakPos[i][2]*.6;
				scene.add( posLight[i] );
        
        // posLight[i] = new THREE.PointLight( 0xff1493, 1, 100 );
        // posLight[i].add(posRep[i]);
        // 

        scene.add(posRep[i])
        //scene.add(posLight[i]);
        createSourceMesh(posRep[i], speakPos[i]);
    
    
    //}
    // var light = new THREE.AmbientLight( 0x404040 ); // soft white light
    // scene.add( light );
    

}



function createPans(){
        for (i=0; i <8; i++) {

            srcBuf[i] = new Tone.Buffer(srcLoc[i], function(){
                //the buffer is now available.
                // create the panner objects
                panObj[i] = new Tone.Panner3D().toMaster();
                metObj[i]= new Tone.Meter();
                srcObj[i]= new Tone.Player({

                    url :srcBuf[i],
                    loop : true

                }).connect(panObj[i]).connect(metObj[i]).sync().start(0);

        createReps(i);
        counter =i;
        });
    }
}
//******************************** */
//update
//******************************** */

function updatePanners(counter){ 
    // while (counter <7){}
    if (counter => 7){

   
        for (i=0;i<8; i++){
            // add to animation loop to affect panner
            
            panObj[i].updatePosition(posRep[i]);

            // update level to control scale
            var level = metObj[i].getValue();
                posRep[i].scale.x = level*25+.1;
                posRep[i].scale.z = level*25+.1;
                posRep[i].scale.y = level*25+.1;
               posLight[i].intensity = level+.1;
            
        }
    }

}

function bufDispose(){
    for (i=0; i <8; i++) {

        srcBuf[i].dispose();
    }
}