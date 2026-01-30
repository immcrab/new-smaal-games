var ad1 = null;
window.showAd1 = function(){
	destroyAd1();
	ad1 = document.createElement('div');
    // we make it ignore any standard positioning
	ad1.style.position = 'absolute';
	ad1.setAttribute('id', 'q7');	
	// position it here, 50% is in the center
	ad1.style.left = '50%';
	// 25% is close to the bottom
	ad1.style.bottom = '2%';
	// potential padding
	ad1.style.paddingBottom = '2px';
	// put the pivot of the ad in the center
	ad1.style.transform = 'translate(-50%, -50%)';
	document.body.appendChild(ad1);
	PokiSDK.displayAd(ad1, '728x90');
}
window.showAd2 = function(){
	destroyAd1();
	ad1 = document.createElement('div');
    // we make it ignore any standard positioning
	ad1.style.position = 'absolute';
	ad1.setAttribute('id', 'q7');
	// position it here, 50% is in the center
	ad1.style.left = '50%';
	// 25% is close to the bottom
	ad1.style.bottom = '33%';
	ad1.style.marginTop = "0";
	// potential padding
	ad1.style.paddingBottom = '2px';
	// put the pivot of the ad in the center
	ad1.style.transform = 'translate(-50%, -50%)';	
	document.body.appendChild(ad1);
	PokiSDK.displayAd(ad1, '320x50');
}

window.showAd3 = function(){
	destroyAd1();
	ad1 = document.createElement('div');
    // we make it ignore any standard positioning
	ad1.style.position = 'absolute';
	ad1.setAttribute('id', 'q7');
	// position it here, 50% is in the center
	ad1.style.left = '50%';
	// 25% is close to the bottom
	ad1.style.bottom = "0";
     ad1.style.marginTop = "-20%";
	// potential padding
	ad1.style.paddingBottom = '2px';
	// put the pivot of the ad in the center
	ad1.style.transform = 'translate(-50%, -50%)';	
	document.body.appendChild(ad1);
	PokiSDK.displayAd(ad1, '320x50');
}


window.setPositionLandscape=function(){
	if(ad1){
	 ad1.style.bottom = "0";
     ad1.style.marginTop = "-20%";
	}
}

window.setPositionPortrait=function(){
	if(ad1){
	ad1.style.bottom = "33%";
	ad1.style.marginTop = "0";
	}
}

window.destroyAd1 = function(){
	if(ad1){
		PokiSDK.destroyAd(ad1);
		ad1 = null;
	}
}









const scriptsInEvents = {

	async Gameeventsheet_Event4_Act1(runtime, localVars)
	{
		PokiSDK.gameplayStop();
	},

	async Gameeventsheet_Event67_Act1(runtime, localVars)
	{
		PokiSDK.gameplayStop();
	},

	async Gameeventsheet_Event69_Act1(runtime, localVars)
	{
		PokiSDK.gameplayStop();
	},

	async Gameeventsheet_Event71_Act1(runtime, localVars)
	{
		window.showAd2();
	},

	async Gameeventsheet_Event72_Act1(runtime, localVars)
	{
		window.showAd3();
	},

	async Gameeventsheet_Event73_Act1(runtime, localVars)
	{
		window.showAd1();
	},

	async Gameeventsheet_Event140_Act1(runtime, localVars)
	{
		window.destroyAd1();
	},

	async Gameeventsheet_Event141_Act1(runtime, localVars)
	{
		  PokiSDK.commercialBreak()
		   .then(() => { 
		   PokiSDK.gameplayStart();
		   });
	},

	async Gameeventsheet_Event146_Act1(runtime, localVars)
	{
		window.destroyAd1();
	},

	async Gameeventsheet_Event147_Act1(runtime, localVars)
	{
		PokiSDK.gameplayStop();
	},

	async Gameeventsheet_Event147_Act2(runtime, localVars)
	{
		  PokiSDK.commercialBreak()
		   .then(() => { 
		   PokiSDK.gameplayStart();
		   });
	},

	async Gameeventsheet_Event178_Act1(runtime, localVars)
	{
		window.destroyAd1();
	},

	async Gameeventsheet_Event180_Act1(runtime, localVars)
	{
		window.destroyAd1();
	},

	async Gameeventsheet_Event180_Act2(runtime, localVars)
	{
		 PokiSDK.rewardedBreak().then(
		 
		        (withReward) => {
		            if(withReward){
		               
		                //resume game
						runtime.callFunction("rewardedSuccesfull3");
						
		            }else{
					
					}
		        }
		
		    )
	},

	async Gameeventsheet_Event186_Act1(runtime, localVars)
	{
		PokiSDK.gameplayStop();
	},

	async Gameeventsheet_Event186_Act2(runtime, localVars)
	{
		 PokiSDK.rewardedBreak().then(
		 
		        (withReward) => {
		            if(withReward){
		               
		                //resume game
						runtime.callFunction("rewardedSuccesfull2");
						PokiSDK.gameplayStart();
		            }else{
					PokiSDK.gameplayStart();
					}
		        }
		
		    )
	},

	async Gameeventsheet_Event187_Act1(runtime, localVars)
	{
		PokiSDK.gameplayStop();
	},

	async Gameeventsheet_Event187_Act2(runtime, localVars)
	{
		 PokiSDK.rewardedBreak().then(
		 
		        (withReward) => {
		            if(withReward){
		               
		                //resume game
						runtime.callFunction("rewardedSuccesfull2");
						PokiSDK.gameplayStart();
		            }else{
					PokiSDK.gameplayStart();
					}
		        }
		
		    )
	},

	async Maineventsheet_Event1_Act25(runtime, localVars)
	{
		PokiSDK.init().then(
		    () => {
		    }   
		).catch(
		    () => {    
		    }   
		);
	},

	async Maineventsheet_Event15_Act1(runtime, localVars)
	{
		  PokiSDK.commercialBreak()
		   .then(() => { 
		   PokiSDK.gameplayStart();
		   });
	},

	async Maineventsheet_Event20_Act1(runtime, localVars)
	{
		 PokiSDK.rewardedBreak().then(
		 
		        (withReward) => {
		            if(withReward){
		               
		                //resume game
						runtime.callFunction("rewardedSuccesfull");
						PokiSDK.gameplayStart();
		            }else{
					PokiSDK.gameplayStart();
					}
		        }
		
		    )
	},

	async Subleveleventsheet_Event13_Act4(runtime, localVars)
	{
		PokiSDK.gameplayStart();
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

