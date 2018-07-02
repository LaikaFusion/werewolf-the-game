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
    removeProtection(memberName){

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

function night(gameObj){
    let victim ; 
    //start is a werewolf vote
    console.log("Werewolves please vote, you have thirt seconds. Failure to vote unanimously will end with no kills.");
    //start vote timer here: need to figure out a way to skip on (idea: split functions more)
    setTimeout(function(){ console.log("Times up!") }, 30000);
    //recieve votes here
    gameObj.voteToKill(memberVotedFor);
    //return an indication of who the other players has voted for
    //count number of returned votes 
    if(returnedVotes === gameObj.werewolfList.length){
        const voteReturn = gameObj.voteResults();
            if (voteReturn==="tie") {
                console.log("Tie votes will result in no death");
            }
            else{
                //no death call here because we need to check if the doctor has added protection first
                victim = voteReturn;
                gambeObj.voteClear();

            }
    }
    else{
        console.log("All werewolves must vote ")
    }
    //next is doctors turn 
    //todo: check if doctor is still alive
    console.log("Doctor, you're up!")
    //aquire doctor's pick here
    gameObj.protectPlayer(docVote);

    if (gameObj.memberList.protectPlayer === false){
        gameObj.chooseVictim(victim);
    }
    else{
        //todo: add message for day reading
    }
    //remove protection
    gameObj.removeProtection(docVote);
    //check if werewolves have won
    const gameWon = gameObj.hasWon();
    
    if (gameWon === true){
        gameObj.endGame();
    }
    //if game hasn't been won seer's turn 
    //todo: check if seer is alive
    console.log("Seer it's your turn!");
    //get seer check request
    const seerCheck = gameObj.queryWerewolfStatus(seerRequest);
    if (seerCheck === true){
        console.log( `${seerRandIndex} is a werewolf!`);
    }
    else {
        console.log(`${seerCheck} is not a werewolf`)
    }
    day(gameObj);
}

function day(gameObj){

}

