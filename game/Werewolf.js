class Werewolf {
	constructor() {
		this.membersList = [];
		this.votes = {};
	}
	
	addMember(member) {
		this.memberList.push(member);
	}
	
	assignRolesToMembers() {
		let numberOfWerewolves = Math.floor(this.members.length / 3);
		let chosenIndexes = [];
		for(let i = 0; i < numberOfWerewolves.length; i++) {
			let randIndex = Math.floor(Math.random() * this.members.length);
			if (!chosenIndexes.includes(randIndex)) {
				chosenIndexes.push(randIndex);
			} else {
				i--;
			}
		}
		chosenIndexes.forEach(function(index) {
			this.members[index].isWerewolf = true;
		});
		
		// similarly choose a random healer and seer
	}
	
	voteToKill(member) {
		this.votes[member] = (this.votes[member] + 1 ) || 1;
	}
	
	voteResults() {
		// Analyze the votes object find the member with highest votes as value
		// return the name of the member
		// set the votes object to empty object for next round of voting
		// check if game ends if this member is removed
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