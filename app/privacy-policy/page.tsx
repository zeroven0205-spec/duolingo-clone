export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#ffffff]">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="mb-8 text-4xl font-bold text-[#1cb0f6]">隐私政策</h1>
        <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
          <p className="text-sm text-gray-500">更新日期：2026年7月1日</p>

          <h2 className="text-2xl font-semibold text-gray-900">一、信息收集</h2>
          <p>我们收集您主动提供的信息，包括注册账户时的邮箱、学习进度、答题数据，以及通过 Cookie 收集的浏览行为数据。</p>

          <h2 className="text-2xl font-semibold text-gray-900">二、信息使用</h2>
          <p>您的数据用于：提供个性化学习体验、分析学习效果、改进产品功能、发送学习提醒。我们不会将您的个人信息出售给第三方。</p>

          <h2 className="text-2xl font-semibold text-gray-900">三、信息共享</h2>
          <p>我们与Stripe（支付）、Clerk（认证）等服务商共享必要数据，用于处理付款和用户认证。所有服务商均需遵守数据保护义务。</p>

          <h2 className="text-2xl font-semibold text-gray-900">四、Cookie政策</h2>
          <p>我们使用Cookie来记住您的偏好设置、分析网站流量。您可以通过浏览器设置禁用Cookie，但这可能影响部分功能。</p>

          <h2 className="text-2xl font-semibold text-gray-900">五、数据安全</h2>
          <p>我们采用加密传输（HTTPS）、数据隔离、访问控制等措施保护您的数据。但互联网传输无法保证100%安全。</p>

          <h2 className="text-2xl font-semibold text-gray-900">六、用户权利</h2>
          <p>您有权访问、导出、更正、删除您的个人数据。如需行使这些权利，请联系我们。</p>

          <h2 className="text-2xl font-semibold text-gray-900">七、未成年人隐私</h2>
          <p>我们不刻意收集未满14周岁儿童的信息。如您未满14周岁，请在监护人陪同下使用本服务。</p>

          <h2 className="text-2xl font-semibold text-gray-900">八、变更通知</h2>
          <p>我们会通过网站公告通知隐私政策的重大变更。继续使用服务即表示您接受更新后的政策。</p>

          <h2 className="text-2xl font-semibold text-gray-900">九、联系我们</h2>
          <p>如对隐私政策有疑问，请联系：privacy@lingo-app.com</p>
        </div>
      </div>
    </main>
  );
}
