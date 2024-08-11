export interface Student {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  email: string;
  address: string; 
  state: string;
  city: string;
  pincode: string;
  subjects: string[];
  previous_education: Education[];
}

export interface Education {
  previous_school: string;
  year_of_start: string;
  year_of_end: string;
}
