import { ResponseService } from './response.service';

const expectedAnswers = {
  firstQuestion: 1,
  secondQuestion: 5,
};

const correctResponses = [
  { answeredIndex: 1, questionId: 'firstQuestion', userId: 'user1' },
  { answeredIndex: 5, questionId: 'secondQuestion', userId: 'user1' },
];

const inCorrectResponses = [
  { answeredIndex: 2, questionId: 'firstQuestion', userId: 'user1' },
  { answeredIndex: 1, questionId: 'secondQuestion', userId: 'user1' },
];

// Straight Jasmine testing without Angular's testing support
describe('ResponseService', () => {
  let service: ResponseService;
  beforeEach(() => {
    service = new ResponseService();
  });

  it('#checkIfResponseMatches should return true for expected answers', (done: DoneFn) => {
    // @ts-ignore
    const isMatch = service.checkIfResponseMatches(
      correctResponses,
      expectedAnswers
    );
    expect(isMatch).toBeTrue();
    done();
  });

  it('#checkIfResponseMatches should return false for incorrect answers', (done: DoneFn) => {
    // @ts-ignore
    const isMatch = service.checkIfResponseMatches(
      inCorrectResponses,
      expectedAnswers
    );
    expect(isMatch).toBeFalse();
    done();
  });

  it('#getLiveFilteredCount should fire only once when correct answers were given', (done: DoneFn) => {
    let invoked = 0;
    service.getLiveFilteredCount(expectedAnswers).subscribe((value) => {
      invoked++;
    });
    service.saveResponses(correctResponses).subscribe();
    service.saveResponses(inCorrectResponses).subscribe();
    setTimeout(() => {
      expect(invoked).toBe(1);
      done();
    }, 100);
  });

  it('#getLiveFilteredCount should never fire if incorrect answers were given', (done: DoneFn) => {
    let invoked = 0;
    service.getLiveFilteredCount(expectedAnswers).subscribe((value) => {
      invoked++;
    });
    service.saveResponses(inCorrectResponses).subscribe();
    setTimeout(() => {
      expect(invoked).toBe(0);
      done();
    }, 100);
  });
});
