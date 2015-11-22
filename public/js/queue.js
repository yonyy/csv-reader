var Queue = function() {
	this.size = 0
	this.first = null
	this.last = null
}
var Node = function (data) {
	this.data = data
	this.next = null
}
Queue.prototype.enqueue = function(data) {
	var node = new Node(data)
	if (!this.first) {
		this.first = node
		this.last = node
	}
	else {
		this.last.next = node
		this.last = node
	}

	this.size += 1
};

Queue.prototype.dequeue = function() {
	var data = this.first
	this.first = this.first.next
	this.size -= 1
	return data
};

/*var q = new Queue()
q.enqueue(1)
q.enqueue(2)
q.enqueue(3)
console.log(q.first.data)
console.log(q.last.data)
console.log(q.dequeue())
console.log(q.first.data)*/