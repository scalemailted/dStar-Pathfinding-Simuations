class PriorityQueue {
    constructor() {
      this.items = [];
    }
    
    insert(item, priority) {
      this.items.push({ item: item, priority: priority });
      this.items.sort(function(a, b) {
        return a.priority - b.priority;
      });
    }
    
    enqueue(item, priority) {
      this.items.push({ item: item, priority: priority });
      this.items.sort(function(a, b) {
        return a.priority - b.priority;
      });
    }
    
    dequeue() {
      if (this.isEmpty()) {
        return null;
      }
      return this.items.shift().item;
    }
    
    pop() {
      if (this.isEmpty()) {
        return null;
      }
      return this.items.pop().item;
    }
    
    top() {
      return this.items[0].item;
    }
    
    topKey() {
      return this.items[0].priority;
    }
    
    isEmpty() {
      return this.items.length == 0;
    }
  }
  
  