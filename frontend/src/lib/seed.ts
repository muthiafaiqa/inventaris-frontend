import supabase from './supabaseClient';

export interface SeedProduct {
  sku: string;
  nama: string;
  unit: string;
  harga: number;
  min_stock: number;
}

export interface SeedSales {
  product_id: string;
  bulan: number;
  tahun: number;
  qty_sold: number;
}

/**
 * Seeder script to populate Supabase products and sales_history tables.
 */
export async function runSeed() {
  console.log('Memulai proses seeding database...');

  try {
    // 1. Clean existing records (foreign key cascade will handle deletion in sales_history if products are deleted)
    // Using a broad delete command that is safe and compatible with standard RLS policies
    const { error: clearSalesError } = await supabase
      .from('sales_history')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (clearSalesError) {
      console.warn('Gagal membersihkan data sales_history:', clearSalesError.message);
    }

    const { error: clearProductsError } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (clearProductsError) {
      console.warn('Gagal membersihkan data products:', clearProductsError.message);
    }

    // 2. Define premium products to seed (inventory of electrical components)
    const productsToSeed: SeedProduct[] = [
      { sku: 'LMP-LED-10W-PH', nama: 'Lampu LED Philips 10W Cool Daylight', unit: 'pcs', harga: 45000, min_stock: 20 },
      { sku: 'LMP-LED-15W-PH', nama: 'Lampu LED Philips 15W Cool Daylight', unit: 'pcs', harga: 58000, min_stock: 15 },
      { sku: 'KBL-NYA-15-SP', nama: 'Kabel NYA 1.5mm Supreme (100 Meter)', unit: 'Roll', harga: 320000, min_stock: 6 },
      { sku: 'KBL-NYM-215-SP', nama: 'Kabel NYM 2x1.5mm Supreme (50 Meter)', unit: 'Roll', harga: 480000, min_stock: 4 },
      { sku: 'PNL-SRY-100WP-MC', nama: 'Panel Surya 100WP Monocrystalline Solar', unit: 'pcs', harga: 890000, min_stock: 5 },
      { sku: 'PNL-SRY-200WP-MC', nama: 'Panel Surya 200WP Monocrystalline Solar', unit: 'pcs', harga: 1650000, min_stock: 3 }
    ];

    const { data: insertedProducts, error: insertProdError } = await supabase
      .from('products')
      .insert(productsToSeed)
      .select();

    if (insertProdError) {
      throw new Error(`Gagal menginput data produk: ${insertProdError.message}`);
    }

    if (!insertedProducts || insertedProducts.length === 0) {
      throw new Error('Tidak ada data produk yang berhasil dimasukkan.');
    }

    console.log(`Berhasil menginput ${insertedProducts.length} produk.`);

    // 3. Define historical sales records for the past 6 months (Januari 2026 - Juni 2026)
    const salesToSeed: SeedSales[] = [];
    const year = 2026;

    insertedProducts.forEach((product: any) => {
      // Establish customized sales quantities per SKU to simulate realistic linear trends
      let baseQty = 15;
      let trendSlope = 3; // positive sales trend

      if (product.sku.startsWith('LMP')) {
        baseQty = 30;
        trendSlope = 5; // steeper slope for fast moving items
      } else if (product.sku.startsWith('KBL')) {
        baseQty = 8;
        trendSlope = 1.5;
      } else if (product.sku.startsWith('PNL')) {
        baseQty = 3;
        trendSlope = 0.8; // slower moving solar items
      }

      // Generate 6 months of historical data (month 1 to 6)
      for (let month = 1; month <= 6; month++) {
        // Add a cyclic sine wave component for variation
        const variation = Math.floor(Math.sin(month * 1.5) * 3);
        const qty_sold = Math.max(1, Math.round(baseQty + (month * trendSlope) + variation));

        salesToSeed.push({
          product_id: product.id,
          bulan: month,
          tahun: year,
          qty_sold
        });
      }
    });

    const { error: insertSalesError } = await supabase
      .from('sales_history')
      .insert(salesToSeed);

    if (insertSalesError) {
      throw new Error(`Gagal menginput data riwayat penjualan: ${insertSalesError.message}`);
    }

    console.log(`Berhasil menginput ${salesToSeed.length} record penjualan historis.`);
    return { success: true, message: 'Database seeder berhasil dieksekusi.' };

  } catch (err: any) {
    console.error('Error saat seeding database:', err);
    return { success: false, message: err.message || 'Terjadi kesalahan sistem.' };
  }
}
export default runSeed;
