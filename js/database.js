
const _FALLBACK_PRODUCTS = {"products":[{"id":1,"name":"Ferrari SF90 Stradale","brand":"Ferrari","category":"Hypercar","price":507000,"year":2023,"image":"images/Ferrari-SF90-Stradale.jpg","description":"Đỉnh cao công nghệ hybrid của Ferrari — SF90 Stradale kết hợp động cơ V8 Twin-Turbo 3.9L với ba mô-tơ điện cho sức mạnh tổng hợp 986 mã lực. Đây là siêu xe mạnh mẽ nhất từ trước đến nay xuất xưởng từ Maranello, sở hữu hệ thống dẫn động 4 bánh toàn phần (4WD), cầu nối hoàn hảo giữa công nghệ đua xe F1 và đường phố.","specifications":{"engine":"3.9L V8 Twin-Turbo + 3 EM Hybrid","horsepower":986,"topSpeed":340,"acceleration":"2.5s (0–100 km/h)"},"inStock":true,"quantity":2,"createdAt":"2026-01-15T08:00:00Z","updatedAt":"2026-04-16T10:00:00Z"},{"id":2,"name":"Ferrari 296 GTB","brand":"Ferrari","category":"Sports Car","price":322000,"year":2023,"image":"images/Ferrari-296-GTB.jpg","description":"Ferrari 296 GTB đánh dấu sự trở lại của động cơ V6 huyền thoại tại Maranello sau hơn 50 năm, kết hợp cùng mô-tơ điện cho tổng công suất 830 mã lực. Kiểu dáng fastback hiện đại lấy cảm hứng từ những huyền thoại như 250 LM.","specifications":{"engine":"3.0L V6 Twin-Turbo + 1 EM Hybrid","horsepower":830,"topSpeed":330,"acceleration":"2.9s (0–100 km/h)"},"inStock":true,"quantity":3,"createdAt":"2026-02-01T08:00:00Z","updatedAt":"2026-04-16T10:00:00Z"},{"id":3,"name":"Lamborghini Revuelto","brand":"Lamborghini","category":"Hypercar","price":600000,"year":2024,"image":"images/Lamborghini Revuelto.avif","description":"Kế thừa ngai vàng của Aventador, Lamborghini Revuelto là siêu xe hybrid V12 đầu tiên trong lịch sử Sant'Agata Bolognese. Động cơ V12 hút khí tự nhiên huyền thoại kết hợp cùng ba mô-tơ điện cho sức mạnh 1.015 mã lực.","specifications":{"engine":"6.5L V12 N/A + 3 EM Hybrid","horsepower":1015,"topSpeed":350,"acceleration":"2.5s (0–100 km/h)"},"inStock":true,"quantity":1,"createdAt":"2026-02-10T08:00:00Z","updatedAt":"2026-04-16T10:00:00Z"},{"id":4,"name":"Lamborghini Huracán Tecnica","brand":"Lamborghini","category":"Sports Car","price":274000,"year":2023,"image":"images/Lamborghini Huracan Technica.jpg","description":"Lamborghini Huracán Tecnica là đỉnh cao của dòng Huracán — một cú chốt hoàn hảo trước khi kỷ nguyên V10 hút khí tự nhiên thuần túy khép lại.","specifications":{"engine":"5.2L V10 N/A","horsepower":640,"topSpeed":325,"acceleration":"3.2s (0–100 km/h)"},"inStock":true,"quantity":2,"createdAt":"2026-02-20T08:00:00Z","updatedAt":"2026-04-16T10:00:00Z"},{"id":5,"name":"McLaren 750S","brand":"McLaren","category":"Hypercar","price":330000,"year":2023,"image":"images/McLaren 750s.webp","description":"McLaren 750S là sự tiến hóa đỉnh cao của dòng Super Series — nhẹ hơn, mạnh hơn và sắc nét hơn người tiền nhiệm 720S.","specifications":{"engine":"4.0L V8 Twin-Turbo","horsepower":750,"topSpeed":332,"acceleration":"2.8s (0–100 km/h)"},"inStock":true,"quantity":3,"createdAt":"2026-03-01T08:00:00Z","updatedAt":"2026-04-16T10:00:00Z"},{"id":6,"name":"McLaren Solus GT","brand":"McLaren","category":"Hypercar","price":3500000,"year":2024,"image":"images/McLaren Solus GT.webp","description":"McLaren Solus GT là hiện thân của triết học 'One' — một chiếc xe đua track-only với cửa kiểu canopy như buồng lái máy bay chiến đấu. Chỉ 25 chiếc được sản xuất trên toàn thế giới.","specifications":{"engine":"5.0L V10 N/A","horsepower":840,"topSpeed":320,"acceleration":"2.5s (0–100 km/h)"},"inStock":false,"quantity":0,"createdAt":"2026-03-05T08:00:00Z","updatedAt":"2026-04-16T10:00:00Z"},{"id":7,"name":"Porsche 911 GT3 RS","brand":"Porsche","category":"Sports Car","price":225000,"year":2023,"image":"images/porsche 91 gt3 rs.jpg","description":"Porsche 911 GT3 RS là phiên bản đường phố gần nhất với một chiếc xe đua GT. Từng vòng Nürburgring của chiếc GT3 RS là một minh chứng sống về triết học Porsche.","specifications":{"engine":"4.0L Flat-6 N/A","horsepower":525,"topSpeed":296,"acceleration":"3.2s (0–100 km/h)"},"inStock":true,"quantity":2,"createdAt":"2026-03-10T08:00:00Z","updatedAt":"2026-04-16T10:00:00Z"},{"id":8,"name":"Porsche Taycan Turbo GT","brand":"Porsche","category":"Sports Car","price":235000,"year":2024,"image":"images/Porsche_Taycan_Turbo_GT.jpg","description":"Porsche Taycan Turbo GT là siêu xe điện mạnh nhất từ trước đến nay của Stuttgart — 1.092 mã lực từ hai mô-tơ điện, tăng tốc 0–100 km/h chỉ trong 2.2 giây.","specifications":{"engine":"Dual Electric Motor (All-Electric)","horsepower":1092,"topSpeed":305,"acceleration":"2.2s (0–100 km/h)"},"inStock":true,"quantity":2,"createdAt":"2026-03-15T08:00:00Z","updatedAt":"2026-04-16T10:00:00Z"},{"id":9,"name":"Bugatti Chiron Super Sport","brand":"Bugatti","category":"Hypercar","price":3900000,"year":2023,"image":"images/Bugatti-Chiron-Super-Sport.jpg","description":"Bugatti Chiron Super Sport là tuyên ngôn tốc độ tối thượng từ Molsheim — tốc độ đỉnh trên 440 km/h. Khối động cơ W16 8.0L Quad-Turbo cho ra 1.600 mã lực. Chỉ 60 chiếc được sản xuất.","specifications":{"engine":"8.0L W16 Quad-Turbo","horsepower":1600,"topSpeed":440,"acceleration":"2.4s (0–100 km/h)"},"inStock":false,"quantity":0,"createdAt":"2026-03-20T08:00:00Z","updatedAt":"2026-04-16T10:00:00Z"},{"id":10,"name":"Bugatti Bolide","brand":"Bugatti","category":"Hypercar","price":4700000,"year":2024,"image":"images/Bugatti Bolide.jpg","description":"Bugatti Bolide — track-only, cực đoan và không nhân nhượng. W16 Quad-Turbo 1.850 mã lực đẩy khối xe chỉ 1.450 kg đạt tốc độ ước tính hơn 500 km/h. Chỉ 40 chiếc tồn tại.","specifications":{"engine":"8.0L W16 Quad-Turbo","horsepower":1850,"topSpeed":500,"acceleration":"2.1s (0–100 km/h)"},"inStock":false,"quantity":0,"createdAt":"2026-03-25T08:00:00Z","updatedAt":"2026-04-16T10:00:00Z"}],"categories":[{"id":1,"name":"Hypercar","description":"Siêu xe đỉnh cao"},{"id":2,"name":"Sports Car","description":"Xe thể thao cao cấp"}]};

const _FALLBACK_NEWS = {"news":[]};

class Database {
    constructor() {
        this.dataPath = '../data';
       
        this._cache = {
            'product.json': _FALLBACK_PRODUCTS,
            'news.json':    _FALLBACK_NEWS,
        };
    }

    async read(filename) {
        try {
            const response = await fetch(`${this.dataPath}/${filename}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            if (this._cache[filename]) {
                console.info(`[DB] Dùng dữ liệu offline cho ${filename}`);
                return this._cache[filename];
            }
            console.error(`Lỗi khi đọc ${filename}:`, error);
            return null;
        }
    }


    async getProducts() {
        const data = await this.read('product.json');
        const products = data ? data.products : [];
        return this.normalizeProductImages(products);
    }

    normalizeProductImages(products) {
        if (!Array.isArray(products)) return [];

        const imageAliasMap = {
            'images/McLaren Solus GT.webp': '../images/McLaren Solus GT.jpg',
            'images/porsche 91 gt3 rs.jpg': '../images/Porsche 911 GT3 RS.jpg',
            'images/Ferrari-SF90-Stradale.jpg': '../images/Ferrari-SF90-Stradale.jpg',
            'images/Ferrari-296-GTB.jpg': '../images/Ferrari-296-GTB.jpg',
            'images/Lamborghini Revuelto.avif': '../images/Lamborghini Revuelto.avif',
            'images/Lamborghini Huracan Technica.jpg': '../images/Lamborghini Huracan Technica.jpg',
            'images/McLaren 750s.webp': '../images/McLaren 750s.webp',
            'images/Porsche_Taycan_Turbo_GT.jpg': '../images/Porsche_Taycan_Turbo_GT.jpg',
            'images/Bugatti-Chiron-Super-Sport.jpg': '../images/Bugatti-Chiron-Super-Sport.jpg',
            'images/Bugatti Bolide.jpg': '../images/Bugatti Bolide.jpg',
        };

        return products.map((product) => {
            if (!product || typeof product !== 'object') return product;
            let imagePath = product.image || '';

            if (imageAliasMap[imagePath]) {
                imagePath = imageAliasMap[imagePath];
            } else if (typeof imagePath === 'string' && imagePath.startsWith('images/')) {
                imagePath = `../${imagePath}`;
            }

            return { ...product, image: imagePath };
        });
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(p => p.id === parseInt(id));
    }

   
    async searchProducts(query) {
        const products = await this.getProducts();
        const lowerQuery = query.toLowerCase();
        return products.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.brand.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery)
        );
    }

  
    async getNews() {
        const data = await this.read('news.json');
        return data ? data.news : [];
    }

   
    async getFeaturedNews() {
        const news = await this.getNews();
        return news.filter(n => n.featured);
    }

  
    async getNewsByCategory(category) {
        const news = await this.getNews();
        return news.filter(n => n.category === category);
    }


    async getNewsBySlug(slug) {
        const news = await this.getNews();
        return news.find(n => n.slug === slug);
    }

    async getUsers() {
        const data = await this.read('auth.json');
        return data ? data.users : [];
    }

    async getUserByEmail(email) {
        const users = await this.getUsers();
        return users.find(u => u.email === email);
    }

  
    async getSettings() {
        return await this.read('settings.json');
    }

    async getContactInfo() {
        const settings = await this.getSettings();
        return settings ? settings.contact : null;
    }

   
    async getPaymentInfo() {
        const settings = await this.getSettings();
        return settings ? settings.payment : null;
    }
}


const db = new Database();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Database;
}
