const products: any[] = [];

export const db = {
  products: {
    async insert(product: any) {
      products.push(product);
    },
    async findOne(query: any) {
      return products.find(p => p.nfcId === query.nfcId);
    },
    async update(query: any, updated: any) {
      const idx = products.findIndex(p => p.nfcId === query.nfcId);
      if (idx !== -1) products[idx] = updated;
    }
  }
}; 