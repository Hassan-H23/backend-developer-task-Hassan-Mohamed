export class MemberDTO {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  subscriptionDate: string;
  phone?: string;
  centralMemberId?: string | null;
}
