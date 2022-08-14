# Homework

## Data
All data is stored in app/mocks/*.mock.json and can be easily modified for the needs of testing. The assumption was this was a POC and that in the future there may be additional answers coming from external sources or filters.

## Testing
I did little bit of TDD during this homework while working on the most difficult part of the entire task - the filtering of correct answers. It also seems to be the focus of the task and "heart" of the code hence the most reasonable place to test.

## Architecture
I decided to choose the most simplistic way of providing solution and grouped files by their functionality. (ie. services in a separate directory, interfaces in a different one and so on).

### Components

The code was small enough and simple enough that I did not see any reason to split it into multiple components. I was partially tempted to move form creation functionality into a separate service though.

## UI

I used Angular Material as it seemed to be the simplest and the fastest to install and use. There is no styling work involved except for what I deemed to make my work easier (I have a big screen and default Material's size of MatCard was painful to work with). 

## Back-end communication

I assumed that the back-end part of the app would normally mark the questionnaire as "answered" by the user and would not allow the same user to even open the same questionnaire twice. Following this logic, I implemented a small method to remove user who already answered from the list of available users.
I also assumed that displaying the number of users who answered "correctly" (accordingly to the expected answers in the PDF) would be done in a different part of the system. Therefore, I assumed that such communication would be done dynamically over WSS or WS.

I did NOT implement mechanism that would count already existing responses in the system as I did not want to overextend the scope. However, the current implenetations of counting & filtering methods are versatile enough to be useable in such a situation.