type DetailProductPageProps = { params: { slug: string } };

export default function DetailProductPage({ params }: DetailProductPageProps) {
  console.log(params);
  return <div>Product Detail Page for {params.slug}</div>;
}
