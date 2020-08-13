
# Middle weighted of the sliding frame
## Problem describe
- **INPUT**:
- First line contain two number *n (the length of input stack)* and *s (the size of the frame)* separated by a space, ***s* always be an odd number**
- Next *n* line contain single number *x (the value)*
- The input will be pass as an input stream, so you must extract the values as describe above yourself
- **OUTPUT**:
- The frame slide from top to down (or from left to right depend on how you imaginate the input stack)
- Every frame, print the **middle weighted number** of the current frame on a single line without any trailing space to the given output stream
- How to calculate the **middle weighted number**?
- A frame is a collection of number without ordering, the **middle weighted number** is the number stay in the middle of array after sorted by ascending order
- ex: frame: [1, 9, 2, 7, 4] -> frame after sort: [1, 2, 4, 7, 9] -> the number in the middle is 4
- **FULL EXAMPLE**:
- *Given input*
> 10 3
> 8
> 1
> 1
> 5
> 5
> 4
> 7
> 1
> 8
> 3
- *Expected output*
> 1
> 1
> 5
> 5
> 5
> 4
> 7
> 3
- *Explaination*
> 8 |
> 1 | > current frame > sorted: 1 1 8 > print 1
> 1 |
> 5
> 5
> 4
> 7
> 1
> 8
> 3

> 8
> 1 |
> 1 | > current frame > sorted: 1 1 5 > print 1
> 5 |
> 5
> 4
> 7
> 1
> 8
> 3

> 8
> 1
> 1 |
> 5 | > current frame > sorted: 1 5 5 > print 5
> 5 |
> 4
> 7
> 1
> 8
> 3

> 8
> 1
> 1
> 5 |
> 5 | > current frame > sorted: 4 5 5 > print 5
> 4 |
> 7
> 1
> 8
> 3

> 8
> 1
> 1
> 5
> 5 |
> 4 | > current frame > sorted: 4 5 7 > print 5
> 7 |
> 1
> 8
> 3

> 8
> 1
> 1
> 5
> 5
> 4 |
> 7 | > current frame > sorted: 1 4 7 > print 4
> 1 |
> 8
> 3

> 8
> 1
> 1
> 5
> 5
> 4
> 7 |
> 1 | > current frame > sorted: 1 7 8 > print 7
> 8 |
> 3

> 8
> 1
> 1
> 5
> 5
> 4
> 7
> 1 |
> 8 | > current frame > sorted: 1 3 8 > print 3
> 3 |

---
## How to use this package?
1. Read the *Problem describe* to understand what should you do
2. Implement your solution in the file *src/main/java/org/qpro/YourAnswer.java* (inside function *answerTo*)
3. Run **mvn clean test** to compile and run your solution again the test case
4. The result of Correct/Incorrect answer will be list in the output's screen
5. Try to fix all the **Incorrect** answer and submit your implementation to the question provider
