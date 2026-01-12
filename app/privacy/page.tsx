import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>隐私政策</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">隐私政策</h2>
          
          <p className="mb-4">
            我们非常重视您的隐私保护。本隐私政策说明我们如何收集、使用和保护您的个人信息。
          </p>
          
          <h3 className="text-lg font-medium mb-2">信息收集</h3>
          <p className="mb-4">
            我们不会上传或存储您的简历原文或任何个人身份信息。我们仅收集用于改进服务的匿名统计信息，
            如技能标签、学历、工作年限等匿名统计数据，以及操作事件（不含文本内容）。
          </p>
          
          <h3 className="text-lg font-medium mb-2">数据安全</h3>
          <p className="mb-4">
            我们采取适当的技术和组织措施来保护您提供的信息，防止未经授权的访问、使用或披露。
          </p>
          
          <h3 className="text-lg font-medium mb-2">数据使用</h3>
          <p className="mb-4">
            所有收集的信息仅用于改进我们的服务和用户体验，不会用于任何商业目的或分享给第三方。
          </p>
          
          <h3 className="text-lg font-medium mb-2">Cookie政策</h3>
          <p className="mb-4">
            我们可能会使用Cookie来提升您的浏览体验，您可以随时调整浏览器设置来控制Cookie的使用。
          </p>
          
          <h3 className="text-lg font-medium mb-2">遥测数据</h3>
          <p className="mb-4">
            我们的平台支持遥测数据收集功能，但默认情况下处于关闭状态。只有当您明确开启此功能后，
            我们才会收集有关您如何使用我们的工具的匿名数据（不包含您的简历内容），
            以帮助我们改进产品和服务。您可以随时通过点击页面底部的"隐私设置"按钮来更改此设置。
            遥测数据可能包括：页面访问、功能使用情况、错误报告等，但绝不会包含您输入的简历或职位描述文本。
          </p>
          
          <h3 className="text-lg font-medium mb-2">本地存储</h3>
          <p className="mb-4">
            为了提供更好的用户体验，我们在您的浏览器中使用本地存储（localStorage）保存一些设置和匿名ID。
            您可以通过"隐私设置"中的清除数据功能随时删除这些数据。
          </p>
          
          <h3 className="text-lg font-medium mb-2">联系我们</h3>
          <p>
            如您对本隐私政策有任何疑问，请联系我们。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}