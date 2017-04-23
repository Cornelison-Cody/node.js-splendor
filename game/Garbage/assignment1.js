function hero(name){
    this.name = name;
    this.health = 10;
    this.items = [];
    this.display = function(){
        console.log(this.name)
        console.log("Health: " + this.health)
        console.log("Bag: ")
        console.log(this.items.length == 0 ? "empty" : this.items )
    }
    this.give = function(item){
        this.items.push(item);
    }
}
function item(name, power, range){
    this.name = name;
    this.power = power
    this.range = range;
}

var Link = new hero("Link");
var Bomb = new item("bomb",3,9)
var MasterSword=new item("Master Sword",6,2)
var kokiriSword = new item("Kokiri Sword",1,2);

Link.display();
Link.give(Bomb)
Link.give(MasterSword)
Link.give(kokiriSword)
Link.display()

