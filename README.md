# Brief explanation

Please, specific comments and explanations are in the source codes. The basic solution involves using ConcurrentHashMap to provide a native thread-safe memory data repository through a mechanism called Lock. We could use the synchronize approach, but although synchronizes are thread-safety, they perform poorly because they allow only one thread to work at a time. According to [codejava.net](https://www.codejava.net/java-core/collections/understanding-collections-and-thread-safety-in-java#:~:text=%20Understand%20Java%20Collections%20and%20Thread%20Safety%20,we%E2%80%99ve%20understood%20that%20the%20basic%20collection...%20More%20), a "lock has the same basic behavior as classical synchronization but a thread can also acquire it under special conditions: only if the lock is not currently held, or with a timeout, or if the thread is not interrupted. So, useing it we have concurrent collections improved for thread safety and performance". More details in source code. Also it was develped a main runnable file to test in prompt.


# Implement EventStore

In this challenge, you will create a class that implements the `EventStore` 
interface.
 
```java
public interface EventStore {
    void insert(Event event);

    void removeAll(String type);

    EventIterator query(String type, long startTime, long endTime);
}
```

Your implementation should store events in memory, using any data structures 
you see fit for the task. The required behavior for the interface is described in the
provided code javadocs, please see `EventStore` and `EventIterator`
interfaces inside the `src/main/java` directory.
 
The implementation should be correct, fast, memory-efficient, and thread-safe. 
You may consider that insertions, deletions, queries, and iterations 
will happen frequently and concurrently. This will be a system hotspot. Optimize at will. 

We expect you to:
* Write tests;
* Provide some evidence of thread-safety;
* Justify design choices, arguing about costs 
  and benefits involved. You may write those as comments 
  inline or, if you wish, provide a separate document 
  summarizing those choices;
* Write all code and documentation in english.
  
You may use external libraries, but their use has to be 
properly justified as well.
 
This challenge is intentionally simple, we expect a simple,
elegant, and polished solution. There is no unique solution to this challenge. 
The intent is to evaluate candidate's coding proficiency and familiarity with 
tools and best practices.


## Solve this challenge

To solve this challenge, you may fork this repository, then 
send us a link with your implementation. Alternatively, if you do not want to have this repo on
your profile (we totally get it), send us a 
[git patch file](https://www.devroom.io/2009/10/26/how-to-create-and-apply-a-patch-with-git/) 
with your changes.

If you are already in the hiring process, you may send it to 
 whoever is your contact at Intelie. If you wish to apply for a job at 
 Intelie, please send your solution to [trabalhe@intelie.com.br](mailto:trabalhe@intelie.com.br).
