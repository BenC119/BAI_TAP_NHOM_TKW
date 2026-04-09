/**
 * Database Helper - Quản lý các file JSON
 * Cung cấp các hàm sẵn dùng để đọc/ghi dữ liệu
 */

class Database {
    constructor() {
        this.dataPath = 'data';
    }

    /**
     * Đọc dữ liệu từ file JSON
     * @param {string} filename - Tên file (vd: 'product.json')
     * @returns {Promise<Object>} Dữ liệu từ file
     */
    async read(filename) {
        try {
            const response = await fetch(`${this.dataPath}/${filename}`);
            if (!response.ok) {
                throw new Error(`File ${filename} không tồn tại`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Lỗi khi đọc ${filename}:`, error);
            return null;
        }
    }

    /**
     * Lấy tất cả sản phẩm
     */
    async getProducts() {
        const data = await this.read('product.json');
        return data ? data.products : [];
    }

    /**
     * Lấy sản phẩm theo ID
     */
    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(p => p.id === parseInt(id));
    }

    /**
     * Tìm kiếm sản phẩm
     */
    async searchProducts(query) {
        const products = await this.getProducts();
        const lowerQuery = query.toLowerCase();
        return products.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.brand.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery)
        );
    }

    /**
     * Lấy tất cả tin tức
     */
    async getNews() {
        const data = await this.read('news.json');
        return data ? data.news : [];
    }

    /**
     * Lấy tin tức nổi bật
     */
    async getFeaturedNews() {
        const news = await this.getNews();
        return news.filter(n => n.featured);
    }

    /**
     * Lấy tin tức theo danh mục
     */
    async getNewsByCategory(category) {
        const news = await this.getNews();
        return news.filter(n => n.category === category);
    }

    /**
     * Lấy tin tức theo slug
     */
    async getNewsBySlug(slug) {
        const news = await this.getNews();
        return news.find(n => n.slug === slug);
    }

    /**
     * Lấy tất cả người dùng (chỉ dùng phía backend)
     */
    async getUsers() {
        const data = await this.read('auth.json');
        return data ? data.users : [];
    }

    /**
     * Lấy người dùng theo email
     */
    async getUserByEmail(email) {
        const users = await this.getUsers();
        return users.find(u => u.email === email);
    }

    /**
     * Lấy cài đặt trang
     */
    async getSettings() {
        return await this.read('settings.json');
    }

    /**
     * Lấy thông tin liên hệ
     */
    async getContactInfo() {
        const settings = await this.getSettings();
        return settings ? settings.contact : null;
    }

    /**
     * Lấy thông tin thanh toán
     */
    async getPaymentInfo() {
        const settings = await this.getSettings();
        return settings ? settings.payment : null;
    }
}

// Khởi tạo instance Database
const db = new Database();

// Export cho Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Database;
}
