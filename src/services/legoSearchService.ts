import { LegoSet } from '@/types/lego';

export interface WebSearchResult {
  set_num: string;
  name: string;
  year: number;
  num_parts: number;
  theme?: string;
  set_img_url?: string;
  confidence: number;
  source: 'web_search';
  requiresConfirmation: boolean;
}

export class LegoSearchService {
  private static webSearchCache = new Map<string, WebSearchResult>();

  static async getSetInfo(setNumber: string): Promise<LegoSet | WebSearchResult | null> {
    try {
      // Check cache first
      const cacheKey = `web_search_${setNumber}`;
      if (this.webSearchCache.has(cacheKey)) {
        return this.webSearchCache.get(cacheKey)!;
      }

      // Perform web search
      const searchData = await this.performWebSearch(setNumber);
      
      // Validate and score confidence
      const validatedData = this.validateAndScoreSearchData(searchData, setNumber);
      
      if (validatedData.confidence >= 60) {
        this.webSearchCache.set(cacheKey, validatedData);
        return validatedData;
      }
      
      return null;
    } catch (error) {
      console.error(`Web search failed for set ${setNumber}:`, error);
      return null;
    }
  }

  private static async performWebSearch(setNumber: string): Promise<Partial<WebSearchResult>> {
    const searchQuery = `LEGO ${setNumber} pieces year official set`;
    
    try {
      // Use the WebSearch tool available in the environment
      const searchPrompt = `Extract LEGO set information from search results for set ${setNumber}. Look for: name, year, piece count, theme. Return structured data.`;
      
      // This is a placeholder for the actual web search implementation
      // In a real implementation, you would call the WebSearch tool here
      const searchResults = await this.mockWebSearch(setNumber);
      
      return this.parseSearchResults(searchResults, setNumber);
    } catch (error) {
      console.error('Web search error:', error);
      throw error;
    }
  }

  private static async mockWebSearch(setNumber: string): Promise<string[]> {
    // Mock search results for testing - in real implementation this would call WebSearch tool
    const mockResults: { [key: string]: string[] } = {
      '42017': [
        'LEGO Technic Ducati Panigale V4 R 42107 (646 pieces) - LEGO',
        'LEGO Technic Ducati Panigale V4 R motorcycle model kit 2019',
        'Set 42107: Ducati Panigale V4 R - 646 pieces - Released 2019 - Technic theme',
        'Build the iconic Ducati Panigale V4 R superbike with this detailed LEGO set'
      ],
      '77251': [
        'LEGO Star Wars Darth Vader Helmet 75304 (834 pieces) - LEGO',
        'LEGO Star Wars Darth Vader Helmet collectible model 2021',
        'Set 75304: Darth Vader Helmet - 834 pieces - Released 2021 - Star Wars theme'
      ]
    };

    return mockResults[setNumber] || [
      `LEGO Set ${setNumber} collectible model`,
      `LEGO ${setNumber} building set with pieces`,
      `Set ${setNumber} LEGO official release`
    ];
  }

  private static parseSearchResults(results: string[], setNumber: string): Partial<WebSearchResult> {
    const combinedText = results.join(' ');
    
    return {
      set_num: `${setNumber}-1`,
      name: this.extractName(combinedText, setNumber),
      year: this.extractYear(combinedText),
      num_parts: this.extractPieces(combinedText),
      theme: this.extractTheme(combinedText),
      set_img_url: '', // Would be extracted from image search in real implementation
      source: 'web_search',
      requiresConfirmation: true
    };
  }

  private static extractName(text: string, setNumber: string): string {
    // Try to extract LEGO set name
    const patterns = [
      new RegExp(`LEGO\\s+(?:Technic\\s+|Star Wars\\s+|City\\s+|Creator\\s+)?([^(]+?)(?:\\s+${setNumber}|\\s+\\(|$)`, 'i'),
      new RegExp(`${setNumber}[^a-zA-Z]*([A-Z][^(•|]+?)(?:\\s*\\(|$)`, 'i'),
      new RegExp(`Set\\s+${setNumber}[^:]*:\\s*([^-•(]+)`, 'i')
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const name = match[1].trim()
          .replace(/\s+/g, ' ')
          .replace(/^\w+\s+(Set|Model|Kit)\s+/i, '')
          .trim();
        
        if (name.length > 3 && name.length < 100) {
          return name;
        }
      }
    }

    return `LEGO Set ${setNumber}`;
  }

  private static extractPieces(text: string): number {
    const patterns = [
      /(\d{2,5})\s*pieces?/i,
      /(\d{2,5})\s*pcs/i,
      /(\d{2,5})\s*elements?/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const pieces = parseInt(match[1]);
        if (pieces >= 10 && pieces <= 20000) {
          return pieces;
        }
      }
    }

    return 0;
  }

  private static extractYear(text: string): number {
    const yearMatches = text.match(/(19|20)\d{2}/g);
    if (yearMatches) {
      // Get the most recent year that's not in the future
      const currentYear = new Date().getFullYear();
      const validYears = yearMatches
        .map(y => parseInt(y))
        .filter(y => y >= 1958 && y <= currentYear + 2)
        .sort((a, b) => b - a);
      
      if (validYears.length > 0) {
        return validYears[0];
      }
    }

    return 0;
  }

  private static extractTheme(text: string): string {
    const themes = [
      'Technic', 'Star Wars', 'City', 'Creator', 'Friends', 'Ninjago',
      'Harry Potter', 'Marvel', 'DC', 'Architecture', 'Ideas', 'Speed Champions',
      'Jurassic World', 'Disney', 'Minecraft', 'Batman', 'Castle', 'Space'
    ];

    for (const theme of themes) {
      if (text.toLowerCase().includes(theme.toLowerCase())) {
        return theme;
      }
    }

    return '';
  }

  private static validateAndScoreSearchData(data: Partial<WebSearchResult>, setNumber: string): WebSearchResult {
    const checks = {
      hasName: !!data.name && data.name.length > 3 && !data.name.includes('undefined'),
      hasReasonablePieces: (data.num_parts || 0) > 10 && (data.num_parts || 0) < 20000,
      hasValidYear: (data.year || 0) >= 1958 && (data.year || 0) <= new Date().getFullYear() + 2,
      setNumberMatches: data.set_num?.includes(setNumber.toString()) || false,
      hasTheme: !!data.theme && data.theme.length > 0
    };

    const passedChecks = Object.values(checks).filter(Boolean).length;
    const confidence = Math.round((passedChecks / Object.keys(checks).length) * 100);

    return {
      set_num: data.set_num || `${setNumber}-1`,
      name: data.name || `LEGO Set ${setNumber}`,
      year: data.year || 0,
      num_parts: data.num_parts || 0,
      theme: data.theme,
      set_img_url: data.set_img_url || '',
      confidence,
      source: 'web_search',
      requiresConfirmation: confidence < 85
    };
  }
}