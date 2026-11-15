class AppConfig {
	private readonly baseUrl = "http://localhost:4000/api/";

	public readonly productsUrl = this.baseUrl + "products";
	public readonly employeesUrl = this.baseUrl + "employees";
	public readonly categoriesUrl = this.baseUrl + "categories";
    public readonly registerUrl = "http://localhost:4000/api/register";
    public readonly loginUrl = "http://localhost:4000/api/login";
	public readonly topProductsUrl = "http://localhost:4000/api/products/top-three";

	public readonly recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
}

export const appConfig = new AppConfig();
