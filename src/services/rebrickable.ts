import { LegoSet, RebrickableResponse } from '@/types/lego';

const API_BASE_URL = 'https://rebrickable.com/api/v3';
const API_KEY = process.env.REBRICKABLE_API_KEY;

export class RebrickableService {
  private static async makeRequest<T>(endpoint: string): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Authorization': `key ${API_KEY}`,
      'Accept': 'application/json',
    };

    try {
      const response = await fetch(url, { 
        headers,
        next: { revalidate: 86400 } // Cache for 24 hours (86400 seconds)
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`LEGO set not found`);
        }
        if (response.status === 429) {
          throw new Error(`Rate limit exceeded`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching from Rebrickable API: ${url}`, error);
      throw error;
    }
  }

  static async getSetByNumber(setNumber: string): Promise<LegoSet> {
    // Add '-1' suffix if not already present (Rebrickable format)
    const formattedSetNumber = setNumber.includes('-') ? setNumber : `${setNumber}-1`;
    return this.makeRequest<LegoSet>(`/lego/sets/${formattedSetNumber}/`);
  }

  static async getBatchSets(setNumbers: string[]): Promise<LegoSet[]> {
    // Format set numbers with '-1' suffix if not present
    const formattedSetNumbers = setNumbers.map(num => 
      num.includes('-') ? num : `${num}-1`
    );
    
    // Use batch endpoint with comma-separated set numbers
    const setNumsParam = formattedSetNumbers.join(',');
    const response = await this.makeRequest<RebrickableResponse<LegoSet>>(
      `/lego/sets/?set_nums=${setNumsParam}&inc_part_details=1`
    );
    
    return response.results;
  }

  static async searchSets(query: string, page = 1): Promise<RebrickableResponse<LegoSet>> {
    const searchParams = new URLSearchParams({
      search: query,
      page: page.toString(),
      page_size: '20',
    });
    
    return this.makeRequest<RebrickableResponse<LegoSet>>(`/lego/sets/?${searchParams}`);
  }

  static async validateSetNumber(setNumber: string): Promise<boolean> {
    try {
      await this.getSetByNumber(setNumber);
      return true;
    } catch (error) {
      return false;
    }
  }
}