class Werewolf {
	constructor() {
		this.memberList = [];
		this.werewolfList = [];
        this.votes = {};
	}

	addMember(memberObj) {
		this.memberList.push(memberObj);
	}
	
	assignRolesToMembers() {
		let numberOfWerewolves = Math.floor(this.memberList.length / 3);
		let chosenIndexes = [];
		for(let i = 0; i < numberOfWerewolves; i++) {
			let randIndex = Math.floor(Math.random() * this.memberList.length); //Todo :Won't this sometimes return an index in the array +1 to its length?
			if (!chosenIndexes.includes(randIndex)) {
				chosenIndexes.push(randIndex);
			} else {
				i--;
			}
        }
        this.werewolfList = chosenIndexes;
		chosenIndexes.forEach(function(index) {
            this.memberList[index].isWerewolf = true;
		});
		//*Doctor Assignment
		for (let i = 0; i < 1; i++) {
			let doctorRandIndex = Math.floor(Math.random() * this.memberList.length);
			if(this.memberList[doctorRandIndex].isWerewolf != true) {
				this.memberList[doctorRandIndex].isDoctor = true;
			} else {
				i--;
			}
		}
		//*Seer Assignment
		for (let i =0; i < 1; i++) {
			let seerRandIndex = Math.floor(Math.random() *thix.memberList.length);
			if(this.memberList[seerRandIndex].isWerewolf != true && this.memberList[seerRandIndex].isDoctor != true) {
				this.memberList[seerRandIndex].isSeer = true;
			} else {
				i--;
			}
		}
	}
	
	voteToKill(member) {
		this.votes[member] = this.votes[member] + 1  || 1;
	}
	
	voteTalley() {
		// Analyze the votes object find the member with highest votes as value
		// return the name of the member
		// set the votes object to empty object for next round of voting
		// check if game ends if this member is removed 
		for (
	}

	voteClear() {

	}
	
	chooseVictim(member) {
		// remove this member from the array
		// check if the game has ended
	}
	
	protectPlayer(member) {
		// set the member.protected = true, on next kill set protected to false for all members
	}
	
	queryWerewolfStatus(member) {
		// straight forward return member.isWerewolf
	}
	
	endGame(callback) {
		// if the game has ended invoke the callback with the winner of the game
	}
}


/// Game Loop


function newGame(memberArray){

    let game = new Werewolf();
    
    memberArray.forEach(element => {
        game.addMember(element);
    });
    
    game.assignRolesToMembers();

    console.log(`Member list populated`);

    game.membersList.forEach(element => {
        if(element.isWerewolf=== true){
            rolePasser("werewolf",element);
        }
        else if(element.isDoctor === true){
            rolePasser("doctor",element);
        }
        else if (element.isSeer === true){
            rolePasser("seer",element);
        }
        else{
            rolePasser("villager", element);
        }
    });
  


}

function rolePasser(role,member){
    //Will pass the role back to the member 
    console.log(`Your role is ${role}`);
}