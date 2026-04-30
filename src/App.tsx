/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Film, 
  Zap, 
  Send, 
  Copy, 
  Plus, 
  Minus, 
  Languages, 
  Volume2, 
  Sun, 
  Target, 
  Check, 
  AlertCircle,
  ChevronRight,
  MoveHorizontal,
  LayoutGrid,
  Shield,
  Sword,
  Clock,
  Smile,
  Crosshair,
  ExternalLink,
  LogOut,
  Coffee,
  DollarSign,
  ShoppingCart,
  Home,
  MessageCircle,
  ChefHat,
  Utensils,
  Fish,
  Flame,
  IceCream,
  Pizza,
  Soup,
  Snail,
  Apple,
  Shrimp,
  MapPin,
  Key,
  X,
  Video,
  Upload,
  Scan,
  RefreshCw,
  Wand2,
  Briefcase,
  GraduationCap,
  Users,
  PawPrint,
  Heart,
  Megaphone,
  Smartphone,
  Scale,
  Wine,
  Gift,
  Activity,
  Cpu,
  Skull,
  Star,
  UserX,
  ShieldCheck,
  Car,
  Compass,
  CloudLightning,
  Ghost,
  Store,
  HelpCircle,
  Droplet,
  Leaf,
  Palette,
  Snowflake,
  Crown,
  GlassWater,
  ShoppingBag,
  Scissors,
  Dumbbell,
  Monitor,
  Map,
  Ticket,
  Banknote,
  Baby,
  FileText,
  Plane,
  Palmtree,
  Mountain,
  Tent,
  Bike,
  Building,
  Ship,
  Train,
  BaggageClaim,
  Camera,
  Tag,
  Package,
  BookOpen,
  Gem,
  Image as ImageIcon,
  Shirt,
  RotateCw,
  Timer,
  Laugh,
  Hammer,
  TreePine,
  Waves,
  Wind,
  Moon,
  Music
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";

// --- CONFIG & CONSTANTS ---
const MODEL_NAME = "gemini-3-flash-preview";

const MODULES = [
  { id: 'action', label: 'Hành Động', icon: Sword },
  { id: 'comedy', label: 'Hài Hước', icon: Smile },
  { id: 'mukbang', label: 'Mukbang ASMR', icon: Utensils },
  { id: 'travel', label: 'Du lịch', icon: Plane },
  { id: 'sales', label: 'AI Bán Hàng', icon: ShoppingBag },
  { id: 'fashion', label: 'AI Thời Trang', icon: Shirt },
  { id: 'survival_timelapse', label: 'Sinh Tồn Time-lapse', icon: Timer },
  { id: 'cooking', label: 'Nấu Ăn', icon: ChefHat },
  { id: 'cooking_comedy', label: 'Nấu Ăn + Hài', icon: Laugh },
  { id: 'comedy_action', label: 'Hài & Hành Động', icon: Laugh },
  { id: 'troll', label: 'Hài Troll', icon: Ghost },
  { id: 'tom_chien', label: 'TÔM CHIÊN', icon: Shrimp },
  { id: 'video_clone', label: 'Sao chép Video', icon: Video },
] as const;

type ModuleType = typeof MODULES[number]['id'];

const THEMES: Record<ModuleType, {id: string, label: string, icon: any}[]> = {
  action: [
    { id: 'default', label: 'Mặc định', icon: Zap },
    { id: 'ancient', label: 'Cổ trang', icon: Sword },
    { id: 'time_travel', label: 'Xuyên không', icon: Clock },
    { id: 'prison', label: 'Trong tù', icon: Shield },
    { id: 'prison_karma', label: 'Trong tù (Karma/Justice)', icon: Shield },
    { id: 'revenge', label: 'Báo thù', icon: Target },
    { id: 'revenge_karma', label: 'Báo thù (Karma/Justice)', icon: Target },
    { id: 'rescue', label: 'Giải cứu', icon: Sparkles },
    { id: 'survival', label: 'Sinh tồn', icon: AlertCircle },
    { id: 'spy', label: 'Gián điệp', icon: Target },
    { id: 'scifi', label: 'Viễn tưởng', icon: Film },
    { id: 'assassin_couple', label: 'Vợ chồng sát thủ', icon: Crosshair },
    { id: 'martial_arts', label: 'Võ thuật', icon: Sword },
    { id: 'cyberpunk', label: 'Cyberpunk 2077', icon: Cpu },
    { id: 'zombie', label: 'Đại dịch Zombie', icon: Skull },
    { id: 'superhero', label: 'Siêu anh hùng', icon: Star },
    { id: 'mafia', label: 'Băng đảng Mafia', icon: UserX },
    { id: 'war', label: 'Chiến tranh quân đội', icon: Crosshair },
    { id: 'heist', label: 'Cướp ngân hàng', icon: Briefcase },
    { id: 'underground_fight', label: 'Đấu trường ngầm', icon: Activity },
    { id: 'sniper', label: 'Lính bắn tỉa', icon: Target },
    { id: 'monster_hunter', label: 'Săn quái vật', icon: Ghost },
    { id: 'bodyguard', label: 'Vệ sĩ', icon: ShieldCheck },
    { id: 'chase', label: 'Rượt đuổi tốc độ', icon: Car },
    { id: 'samurai', label: 'Samurai/Ronin', icon: Sword },
    { id: 'western', label: 'Cao bồi viễn Tây', icon: Compass },
    { id: 'apocalypse', label: 'Hậu tận thế', icon: CloudLightning },
  ],
  comedy: [
    { id: 'default', label: 'Mặc định', icon: Smile },
    { id: 'couple_dialogue', label: 'Đối thoại', icon: MessageCircle },
    { id: 'daily_life', label: 'Đời thường', icon: Coffee },
    { id: 'jealousy', label: 'Ghen tuông', icon: AlertCircle },
    { id: 'secret_money', label: 'Giấu quỹ đen', icon: DollarSign },
    { id: 'shopping', label: 'Đi siêu thị', icon: ShoppingCart },
    { id: 'chores', label: 'Việc nhà', icon: Home },
    { id: 'cooking', label: 'Nấu ăn', icon: ChefHat },
    { id: 'office_life', label: 'Chốn công sở', icon: Briefcase },
    { id: 'school_days', label: 'Học đường', icon: GraduationCap },
    { id: 'in_laws', label: 'Mẹ chồng nàng dâu', icon: Users },
    { id: 'pets', label: 'Thú cưng', icon: PawPrint },
    { id: 'dating', label: 'Hẹn hò', icon: Heart },
    { id: 'neighbors', label: 'Hàng xóm', icon: Megaphone },
    { id: 'tech_struggles', label: 'Mù công nghệ', icon: Smartphone },
    { id: 'diet_fail', label: 'Giảm cân thất bại', icon: Scale },
    { id: 'drunk', label: 'Say xỉn', icon: Wine },
    { id: 'holiday', label: 'Ngày Lễ/Tết', icon: Gift },
    { id: 'blind_date', label: 'Xem mắt thất bại', icon: UserX },
    { id: 'interview', label: 'Phỏng vấn xin việc', icon: FileText },
    { id: 'barber', label: 'Đi cắt tóc', icon: Scissors },
    { id: 'gym_fail', label: 'Tập gym bão táp', icon: Dumbbell },
    { id: 'online_meeting', label: 'Học/Họp online', icon: Monitor },
    { id: 'ghost_prank', label: 'Trêu ma/Nhát ma', icon: Ghost },
    { id: 'lost_way', label: 'Chỉ đường/Lạc đường', icon: Map },
    { id: 'lottery', label: 'Trúng số hụt', icon: Ticket },
    { id: 'borrow_money', label: 'Vay mượn/Đòi nợ', icon: Banknote },
    { id: 'parenting_fail', label: 'Trông trẻ', icon: Baby },
  ],
  mukbang: [
    { id: 'default', label: 'Mặc định', icon: Utensils },
    { id: 'seafood', label: 'Hải sản khổng lồ', icon: Fish },
    { id: 'spicy', label: 'Đồ ăn siêu cay', icon: Flame },
    { id: 'dessert', label: 'Đồ ngọt ngập tràn', icon: IceCream },
    { id: 'fastfood', label: 'Gà rán & Pizza', icon: Pizza },
    { id: 'noodles', label: 'Mì cay & Canh sườn', icon: Soup },
    { id: 'snails', label: 'Ốc các loại', icon: Snail },
    { id: 'fruits', label: 'Trái cây', icon: Apple },
    { id: 'specialties', label: 'Đặc sản vùng miền (Việt Nam)', icon: MapPin },
    { id: 'sushi_sashimi', label: 'Sushi & Sashimi', icon: Fish },
    { id: 'bbq_meat', label: 'Nướng BBQ ngập thịt', icon: Flame },
    { id: 'boba_tea', label: 'Trà sữa khổng lồ', icon: Coffee },
    { id: 'street_food', label: 'Ẩm thực đường phố', icon: Store },
    { id: 'candy_jelly', label: 'Kẹo dẻo & Thạch', icon: Gift },
    { id: 'hotpot', label: 'Lẩu khổng lồ', icon: Soup },
    { id: 'fried_chicken', label: 'Gà rán & Phô mai', icon: Pizza },
    { id: 'exotic_food', label: 'Món ăn kỳ lạ', icon: HelpCircle },
    { id: 'chocolate', label: 'Tháp Chocolate', icon: Droplet },
    { id: 'baking_bread', label: 'Bánh mì & Burger', icon: Home },
    { id: 'vegan', label: 'Mâm chay khổng lồ', icon: Leaf },
    { id: 'colorful_food', label: 'Đồ ăn bảy sắc cầu vồng', icon: Palette },
    { id: 'ice_eating', label: 'Ăn đá lạnh / ASMR', icon: Snowflake },
    { id: 'convenience_store', label: 'Cửa hàng tiện lợi', icon: ShoppingBag },
    { id: 'crunchy', label: 'Đồ ăn siêu giòn', icon: Zap },
  ],
  travel: [
    { id: 'default', label: 'Mặc định', icon: Plane },
    { id: 'beach', label: 'Biển đảo mùa hè', icon: Palmtree },
    { id: 'mountain', label: 'Leo núi & Trekking', icon: Mountain },
    { id: 'camping', label: 'Cắm trại/Glamping', icon: Tent },
    { id: 'road_trip', label: 'Phượt xe máy/Road trip', icon: Bike },
    { id: 'city_tour', label: 'Khám phá thành phố', icon: Building },
    { id: 'food_tour', label: 'Food tour địa phương', icon: Utensils },
    { id: 'heritage', label: 'Di sản & Lịch sử', icon: Camera },
    { id: 'cruise', label: 'Du thuyền trên biển', icon: Ship },
    { id: 'snow', label: 'Làng tuyết nhiệt đới', icon: Snowflake },
    { id: 'desert', label: 'Khám phá sa mạc', icon: Sun },
    { id: 'jungle', label: 'Thám hiểm rừng sâu', icon: Leaf },
    { id: 'train_journey', label: 'Tàu hỏa xuyên Việt', icon: Train },
    { id: 'resort', label: 'Nghỉ dưỡng Resort 5 sao', icon: Wine },
    { id: 'solo_travel', label: 'Du lịch bụi 1 mình', icon: UserX },
    { id: 'couple_travel', label: 'Trăng mật lãng mạn', icon: Heart },
    { id: 'family_trip', label: 'Du lịch gia đình', icon: Users },
    { id: 'backpacking', label: 'Tây ba lô/Backpacking', icon: BaggageClaim },
    { id: 'festival', label: 'Lễ hội văn hóa', icon: Smile },
    { id: 'healing', label: 'Du lịch chữa lành/Yoga', icon: Activity },
  ],
  survival_timelapse: [
    { id: 'default', label: 'Mặc định', icon: Timer },
    { id: 'shelter_build', label: 'Xây trú ẩn từ số 0', icon: Hammer },
    { id: 'primitive_fire', label: 'Kỹ thuật lấy lửa', icon: Flame },
    { id: 'bamboo_hut', label: 'Nhà tre nghệ thuật', icon: TreePine },
    { id: 'island_survival', label: 'Sinh tồn đảo hoang', icon: Waves },
    { id: 'forest_cabin', label: 'Cabin giữa rừng sâu', icon: Home },
    { id: 'clay_pottery', label: 'Làm gốm nguyên thủy', icon: Palette },
    { id: 'water_filter', label: 'Lọc nước tự nhiên', icon: Droplet },
    { id: 'tool_crafting', label: 'Chế tạo công cụ đá', icon: Zap },
    { id: 'food_gathering', label: 'Tìm kiếm thức ăn rừng', icon: Apple },
    { id: 'night_shelter', label: 'Sinh tồn đêm tối', icon: Moon },
    { id: 'underground_bunker', label: 'Bunker ngầm', icon: Shield },
    { id: 'treehouse_build', label: 'Nhà trên cây', icon: TreePine },
    { id: 'raft_expedition', label: 'Đóng bè vượt biển', icon: Ship },
    { id: 'bridge_construction', label: 'Xây cầu gỗ', icon: Hammer },
    { id: 'irrigation_system', label: 'Hệ thống dẫn nước', icon: Droplet },
    { id: 'solar_still', label: 'Lấy nước ngưng tụ', icon: Sun },
    { id: 'fish_trap', label: 'Bẫy cá tự nhiên', icon: Fish },
    { id: 'smoking_meat', label: 'Bảo quản thịt gác bếp', icon: Flame },
    { id: 'bamboo_bike', label: 'Chế xe bằng tre', icon: Bike },
    { id: 'stone_oven', label: 'Lò nướng bằng đá', icon: Soup },
    { id: 'jungle_hammock', label: 'Võng từ dây rừng', icon: Leaf },
    { id: 'natural_soap', label: 'Xà phòng tự nhiên', icon: Droplet },
    { id: 'tree_bark_rope', label: 'Đan dây thừng vỏ cây', icon: Zap },
    { id: 'mud_bricks', label: 'Làm gạch bùn', icon: Home },
    { id: 'waterfall_shower', label: 'Vòi sen thác nước', icon: Waves },
    { id: 'bamboo_raft', label: 'Bè tre đường trường', icon: Ship },
    { id: 'rock_garden', label: 'Vườn đá thiền', icon: Palette },
    { id: 'wood_carving', label: 'Điêu khắc gỗ', icon: Hammer },
    { id: 'jungle_bed', label: 'Giường treo trong rừng', icon: Moon },
    { id: 'primitive_compass', label: 'La bàn nguyên thủy', icon: Compass },
  ],
  cooking: [
    { id: 'fried_chicken', label: 'Gà Rán giòn rụm', icon: Flame },
    { id: 'pizza_master', label: 'Làm Bánh Pizza', icon: Pizza },
    { id: 'fast_food', label: 'Đồ ăn nhanh', icon: ShoppingBag },
    { id: 'default', label: 'Mặc định', icon: ChefHat },
    { id: 'street_cooking', label: 'Ẩm thực đường phố', icon: Utensils },
    { id: 'luxury_dining', label: 'Bữa tối sang trọng', icon: Wine },
    { id: 'traditional_viet', label: 'Bữa cơm truyền thống Việt', icon: Home },
    { id: 'baking_bakery', label: 'Làm bánh mỳ/Bánh ngọt', icon: IceCream },
    { id: 'seafood_feast', label: 'Tiệc hải sản tươi sống', icon: Fish },
    { id: 'spicy_noodle_challenge', label: 'Nấu mì siêu cay', icon: Flame },
    { id: 'vegetarian_master', label: 'Mâm chay tinh tế', icon: Leaf },
    { id: 'outdoor_grill', label: 'Tiệc nướng BBQ ngoài trời', icon: Flame },
    { id: 'soup_art', label: 'Nghệ thuật nấu súp/canh', icon: Soup },
    { id: 'colorful_dessert', label: 'Tráng miệng rực rỡ', icon: Palette },
    { id: 'healthy_meal', label: 'Bữa ăn Eat Clean', icon: Apple },
    { id: 'village_cooking', label: 'Nấu ăn nơi thôn quê', icon: MapPin },
    { id: 'forest_cooking', label: 'Nấu ăn giữa rừng sâu', icon: TreePine },
    { id: 'beach_cooking', label: 'Tiệc nướng bãi biển', icon: Waves },
    { id: 'mountain_hermit_cooking', label: 'Ẩm thực ẩn cư núi cao', icon: Mountain },
    { id: 'minimalist_cooking', label: 'Nấu ăn phong cách tối giản', icon: Snowflake },
    { id: 'night_market_cooking', label: 'Gian hàng chợ đêm', icon: Moon },
    { id: 'ancient_royal_cooking', label: 'Ẩm thực cung đình cổ', icon: Crown },
    { id: 'modern_fusion', label: 'Ẩm thực Fusion hiện đại', icon: Activity },
    { id: 'kids_cooking', label: 'Nấu ăn cho trẻ em', icon: Baby },
    { id: 'breakfast_marathon', label: 'Bữa sáng nhanh gọn', icon: Coffee },
    { id: 'holiday_feast', label: 'Mâm cỗ ngày lễ tết', icon: Gift },
    { id: 'giant_food_cooking', label: 'Nấu món ăn khổng lồ', icon: Scale },
    { id: 'tiny_cooking', label: 'Nấu ăn tí hon', icon: Gem },
    { id: 'experimental_kitchen', label: 'Nấu ăn thực nghiệm', icon: Cpu },
    { id: 'zen_tea_cooking', label: 'Trà đạo & Bánh thiền', icon: Droplet },
    { id: 'party_drinks', label: 'Pha chế đồ uống tiệc', icon: GlassWater },
    { id: 'spices_exploration', label: 'Khám phá gia vị', icon: Zap }
  ],
  cooking_comedy: [
    { id: 'default', label: 'Mặc định', icon: Laugh },
    { id: 'disaster_chef', label: 'Đầu bếp hậu đậu', icon: ChefHat },
    { id: 'fried_chicken_comedy', label: 'Gà rán giòn rụm', icon: Flame },
    { id: 'pizza_comedy', label: 'Làm Pizza chuyên nghiệp', icon: Pizza },
    { id: 'drinks_comedy', label: 'Pha chế đồ uống lạ', icon: GlassWater },
    { id: 'spicy_prank', label: 'Thử thách mì siêu cay', icon: Flame },
    { id: 'clumsy_baking', label: 'Làm bánh vụng về', icon: IceCream },
    { id: 'husband_cooking', label: 'Chồng vào bếp tấu hài', icon: Home },
    { id: 'funny_mukbang_cooking', label: 'Vừa nấu vừa ăn lầy lội', icon: Utensils },
    { id: 'exploding_kitchen', icon: AlertCircle, label: 'Thảm họa bếp núc' },
    { id: 'blindfold_cooking', icon: UserX, label: 'Bịt mắt nấu ăn' },
    { id: 'tiny_cooking_comedy', icon: ShoppingBag, label: 'Nấu ăn tí hon' },
    { id: 'magic_cooking', icon: Wand2, label: 'Nấu ăn ảo thuật' },
    { id: 'bbq_fail', icon: Flame, label: 'Tiệc BBQ cháy khét' },
    { id: 'street_food_comedy', icon: Store, label: 'Street food tấu hài' },
    { id: 'baby_chef', icon: Baby, label: 'Đầu bếp nhí tài năng' },
    { id: 'rich_chef', icon: DollarSign, label: 'Nấu ăn kiểu đại gia' },
    { id: 'budget_cooking', icon: Banknote, label: 'Thử thách 100k' },
    { id: 'coffee_art_comedy', icon: Coffee, label: 'Pha cà phê nghệ thuật' },
    { id: 'kungfu_cooking', icon: Sword, label: 'Nấu ăn kiếm hiệp' }
  ],
  comedy_action: [
    { id: 'default', label: 'Mặc định', icon: Laugh },
    { id: 'clumsy_spy', label: 'Điệp viên vụng về', icon: Target },
    { id: 'drunk_master', label: 'Túy quyền hiện đại', icon: Wine },
    { id: 'kitchen_fight', label: 'Đại chiến bếp núc', icon: ChefHat },
    { id: 'supermarket_chase', label: 'Rượt đuổi siêu thị', icon: ShoppingCart },
    { id: 'office_brawl', label: 'Loạn đả công sở', icon: Briefcase },
    { id: 'buddy_cop', label: 'Cặp bài trùng tấu hài', icon: Users },
    { id: 'martial_arts_fail', label: 'Võ sư dỏm', icon: Sword },
    { id: 'heist_gone_wrong', label: 'Phi vụ trộm hụt', icon: Key },
    { id: 'wedding_chaos', label: 'Đại náo đám cưới', icon: Heart },
    { id: 'street_comedy', label: 'Hiệp sĩ đường phố lầy', icon: MapPin },
    { id: 'grocery_ninja', label: 'Ninja đi siêu thị', icon: ShoppingCart },
    { id: 'elevator_standoff', label: 'Đối đầu thang máy', icon: MoveHorizontal },
    { id: 'laundry_war', label: 'Đại chiến giặt đồ', icon: Shirt },
    { id: 'parkour_fail', label: 'Parkour lỗi cực hài', icon: Activity },
    { id: 'breakfast_duel', label: 'Đấu kịch tính bữa sáng', icon: Coffee },
    { id: 'umbrella_swordsman', label: 'Kiếm sĩ ô che mưa', icon: Wind },
    { id: 'office_chair_race', label: 'Đua ghế xoay công sở', icon: RotateCw },
    { id: 'delivery_hero', label: 'Shipper cứu thế giới', icon: Bike },
    { id: 'cinema_heist', label: 'Trộm bỏng ngô rạp phim', icon: Film },
    { id: 'gym_fight', label: 'Đánh nhau bằng tạ', icon: Dumbbell },
    { id: 'bathroom_slippery', label: 'Trơn trượt nhà tắm', icon: Waves },
    { id: 'dog_walker_chase', label: 'Rượt đuổi dắt chó', icon: PawPrint },
    { id: 'pizza_shield', label: 'Khiên thùng Pizza', icon: Pizza },
    { id: 'dance_brawl', label: 'Vừa nhảy vừa đánh', icon: Music },
    { id: 'selfie_sword', label: 'Kiếm gậy tự sướng', icon: Camera },
    { id: 'keyboard_warrior', label: 'Chiến binh bàn phím', icon: Monitor },
    { id: 'alarm_battle', label: 'Đấu với báo thức', icon: Clock },
    { id: 'escalator_chase', label: 'Rượt đuổi thang cuốn', icon: ChevronRight },
    { id: 'fashion_brawl', label: 'Đánh nhau trên catwalk', icon: Shirt },
    { id: 'grandma_guard', label: 'Bảo vệ hũ mắm của bà', icon: ShieldCheck },
  ],
  sales: [
    { id: 'default', label: 'Mặc định', icon: Tag },
    { id: 'livestream', label: 'Livestream chốt đơn', icon: Video },
    { id: 'review', label: 'Review chân thực', icon: Star },
    { id: 'unboxing', label: 'Đập hộp (Unboxing)', icon: Package },
    { id: 'storytelling', label: 'Kể chuyện (Storytelling)', icon: BookOpen },
    { id: 'humor_sales', label: 'Bán hàng hài hước', icon: Smile },
    { id: 'luxury', label: 'Sang trọng / Cao cấp', icon: Gem },
    { id: 'flash_sale', label: 'Flash Sale / Khuyến mãi', icon: Zap },
  ],
  fashion: [
    { id: 'default', label: 'Mặc định', icon: Shirt },
    { id: 'streetwear', label: 'Streetwear / Bụi bặm', icon: Flame },
    { id: 'office', label: 'Công sở thanh lịch', icon: Briefcase },
    { id: 'vintage', label: 'Vintage / Retro', icon: Camera },
    { id: 'party', label: 'Dạ hội / Tiệc tùng', icon: Wine },
    { id: 'sporty', label: 'Thể thao năng động', icon: Activity },
    { id: 'seasonal', label: 'Đổi mùa Xuân/Thu/Đông', icon: CloudLightning },
    { id: 'lookbook', label: 'Lookbook nghệ thuật', icon: ImageIcon },
  ],
  troll: [
    { id: 'default', label: 'Mặc định', icon: Ghost },
    { id: 'chair_glue', label: 'Dán keo lên ghế', icon: Droplet },
    { id: 'spicy_cake', label: 'Tương ớt vào bánh', icon: Flame },
    { id: 'ghost_scare', label: 'Giả ma nhát bạn', icon: Ghost },
    { id: 'hair_cut', label: 'Cắt tóc khi ngủ', icon: Scissors },
    { id: 'salt_coffee', label: 'Muối vào cà phê', icon: Coffee },
    { id: 'water_spray', label: 'Xịt nước bất ngờ', icon: Droplet },
    { id: 'fish_back', label: 'Dán cá vào lưng', icon: Fish },
    { id: 'clothes_swap', label: 'Tráo đổi quần áo', icon: Shirt },
    { id: 'face_drawing', label: 'Vẽ mặt khi ngủ', icon: Palette },
    { id: 'ice_bath', label: 'Nước đá vào bồn', icon: Snowflake },
    { id: 'blindfold_prank', label: 'Bịt mắt troll ăn', icon: UserX },
    { id: 'phone_hide', label: 'Giấu điện thoại', icon: Smartphone },
    { id: 'slippery_floor', label: 'Xà phòng sàn nhà', icon: Waves },
    { id: 'surprise_popper', label: 'Pháo nổ bất ngờ', icon: Zap },
    { id: 'face_paint', label: 'Quét sơn lên mặt', icon: Palette },
    { id: 'closet_scare', label: 'Hù dọa trong tủ', icon: Home },
    { id: 'tape_handle', label: 'Băng keo tay nắm', icon: Shield },
    { id: 'flour_dryer', label: 'Bột mì máy sấy', icon: Wind },
    { id: 'toy_mouse', label: 'Bẫy chuột đồ chơi', icon: PawPrint },
    { id: 'ink_pillow', label: 'Mực đổ vào gối', icon: Droplet },
    { id: 'fake_injury', label: 'Giả vờ bị thương', icon: Activity },
    { id: 'wifi_prank', label: 'Đổi pass wifi troll', icon: Smartphone },
    { id: 'air_horn', label: 'Còi hơi dưới ghế', icon: Megaphone },
    { id: 'chili_challenge', label: 'Thách ăn ớt cay', icon: Flame },
    { id: 'fake_lotto', label: 'Trúng số giả', icon: Ticket },
    { id: 'balloon_pop', label: 'Nổ bóng sau lưng', icon: Zap },
    { id: 'ketchup_shoe', label: 'Tương cà vào giày', icon: Utensils },
    { id: 'vampire_prank', label: 'Ma cà rồng dọa', icon: Skull },
    { id: 'shampoo_prank', label: 'Gội đầu mãi bọt', icon: Droplet },
    { id: 'electric_shock', label: 'Đồ chơi giật điện', icon: Zap },
  ],
  video_clone: [
    { id: 'default', label: 'Mặc định', icon: Video },
  ],
  tom_chien: [
    { id: 'default', label: 'Mặc định (AI Gợi ý)', icon: Sparkles },
    { id: 'custom', label: 'Nhập món tôm (Tùy chọn)', icon: Plus },
    { id: 'tom_chien_xu', label: 'Tôm chiên xù', icon: Shrimp },
    { id: 'tom_chien_bo_toi', label: 'Tôm chiên bơ tỏi', icon: Shrimp },
    { id: 'tom_chien_trung_muoi', label: 'Tôm chiên trứng muối', icon: Shrimp },
    { id: 'tom_chien_sa_ot', label: 'Tôm chiên sả ớt', icon: Shrimp },
    { id: 'tom_chien_sot_me', label: 'Tôm chiên sốt me', icon: Shrimp },
    { id: 'tom_chien_com', label: 'Tôm chiên cốm', icon: Shrimp },
    { id: 'tom_chien_sot_mayonnaise', label: 'Tôm chiên sốt Mayonnaise', icon: Shrimp },
    { id: 'tom_chien_tempura', label: 'Tôm chiên Tempura Nhật', icon: Shrimp },
    { id: 'tom_chien_muoi_tieu', label: 'Tôm chiên muối tiêu', icon: Shrimp },
    { id: 'tom_chien_ngu_vi', label: 'Tôm chiên ngũ vị hương', icon: Shrimp },
    { id: 'tom_chien_nuoc_mam', label: 'Tôm chiên nước mắm', icon: Shrimp },
    { id: 'tom_chien_chua_ngot', label: 'Tôm chiên sốt chua ngọt', icon: Shrimp },
    { id: 'tom_hum_nuong_pho_mai', label: 'Tôm hùm nướng phô mai', icon: Waves },
    { id: 'tom_hum_hap_bia', label: 'Tôm hùm hấp bia', icon: Waves },
    { id: 'tom_su_rang_muoi', label: 'Tôm sú rang muối', icon: Shrimp },
    { id: 'tom_su_hap_nuoc_dua', label: 'Tôm sú hấp nước dừa', icon: Waves },
    { id: 'tom_nu_hoang_sot_bo', label: 'Tôm nữ hoàng sốt bơ', icon: Crown },
    { id: 'tom_nu_hoang_chien_gion', label: 'Tôm nữ hoàng chiên giòn', icon: Shrimp },
    { id: 'tom_cang_xanh_nuong_moi', label: 'Tôm càng xanh nướng mọi', icon: Flame },
    { id: 'tom_cang_xanh_sot_trung_muoi', label: 'Tôm càng xanh sốt trứng muối', icon: Shrimp },
    { id: 'tom_alaska_sot_cay', label: 'Tôm Alaska sốt cay', icon: Flame },
    { id: 'tom_alaska_hap_toi', label: 'Tôm Alaska hấp tỏi', icon: Waves },
    { id: 'tom_sot_thai_sieu_cay', label: 'Tôm sốt Thái siêu cay', icon: Flame },
    { id: 'tom_xao_cay_tu_xuyen', label: 'Tôm xào cay Tứ Xuyên', icon: Flame },
    { id: 'tom_sot_mala_cay_nong', label: 'Tôm sốt Mala cay nồng', icon: Flame },
    { id: 'tom_nuong_muoi_ot_cay', label: 'Tôm nướng muối ớt cay', icon: Flame },
    { id: 'tom_xao_sa_te_cay', label: 'Tôm xào sa tế cay', icon: Flame },
    { id: 'tom_sot_ot_singapore', label: 'Tôm sốt ớt Singapore', icon: Flame },
    { id: 'tom_chien_toi_ot_hk', label: 'Tôm chiên tỏi ớt Hong Kong', icon: Flame },
    { id: 'tom_tit_rang_muoi_ot', label: 'Tôm tít rang muối ớt', icon: Shrimp },
    { id: 'tom_tit_hap_sa', label: 'Tôm tít hấp sả', icon: Waves },
    { id: 'tom_dat_rang_muoi', label: 'Tôm đất rang muối', icon: Shrimp },
    { id: 'tom_hum_bong_tiet_canh', label: 'Tôm hùm bông (Sashimi)', icon: Waves },
    { id: 'tom_mu_ni_nuong_bo_toi', label: 'Tôm mũ ni nướng bơ tỏi', icon: Shrimp },
    { id: 'tom_chien_bot_trai_cay', label: 'Tôm chiên bột trái cây', icon: Shrimp },
    { id: 'tom_chien_trung_cut', label: 'Tôm chiên trứng cút', icon: Shrimp },
    { id: 'tom_chien_sa_bam', label: 'Tôm chiên sả băm', icon: Shrimp },
    { id: 'tom_chien_bo_chanh', label: 'Tôm chiên sốt bơ chanh', icon: Shrimp },
    { id: 'tom_chien_com_xanh', label: 'Tôm chiên giòn cốm xanh', icon: Shrimp },
    { id: 'tom_chien_thai', label: 'Tôm chiên xù kiểu Thái', icon: Shrimp },
    { id: 'tom_chien_sot_ca_ri', label: 'Tôm chiên sốt cà ri', icon: Shrimp },
    { id: 'tom_chien_wasabi', label: 'Tôm chiên vị wasabi', icon: Shrimp },
    { id: 'tom_chien_com_dep', label: 'Tôm chiên bọc cốm dẹp', icon: Shrimp },
    { id: 'tom_chien_me', label: 'Tôm chiên tẩm vừng (mè)', icon: Shrimp },
    { id: 'tom_chien_rom', label: 'Tôm chiên rơm', icon: Shrimp },
    { id: 'tom_chien_chanh_day', label: 'Tôm chiên sốt chanh dây', icon: Shrimp },
    { id: 'tom_chien_sap_trung_muoi', label: 'Tôm chiên sáp trứng muối', icon: Shrimp },
    { id: 'tom_chien_bo_cay', label: 'Tôm chiên bơ cay', icon: Flame },
    { id: 'tom_chien_mat_ong_toi', label: 'Tôm chiên sốt mật ong tỏi', icon: Shrimp },
    { id: 'tom_chien_khoai_tay', label: 'Tôm chiên bọc khoai tây', icon: Shrimp },
    { id: 'tom_chien_han_quoc', label: 'Tôm chiên sốt Hàn Quốc', icon: Flame },
    { id: 'tom_chien_la_chanh', label: 'Tôm chiên lá chanh', icon: Leaf },
    { id: 'tom_chien_tra_den', label: 'Tôm chiên vị trà đen', icon: Coffee },
    { id: 'tom_chien_tuong_den', label: 'Tôm chiên sốt tương đen', icon: Shrimp },
    { id: 'tom_chien_muoi_kien', label: 'Tôm chiên muối kiến vàng', icon: Ghost },
    { id: 'tom_chien_bot_ngo', label: 'Tôm chiên tẩm bột ngô', icon: Shrimp },
    { id: 'tom_chien_dua', label: 'Tôm chiên xù vị dừa', icon: Waves },
    { id: 'tom_chien_sambal', label: 'Tôm chiên sốt sambal', icon: Flame },
    { id: 'tom_chien_ngu_sac', label: 'Tôm chiên ngũ sắc', icon: Palette },
  ]
};

interface GeneratedPrompt {
  id: number;
  vi_prompt: string;
  en_prompt: string;
  cn_prompt: string;
  tags: string[];
}

// Component for auto-resizing textarea
const AutoResizeTextarea = ({ 
  value, 
  onChange, 
  placeholder, 
  className,
  disabled = false,
  onFocus,
  onBlur
}: { 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; 
  placeholder: string; 
  className: string;
  disabled?: boolean;
  onFocus?: () => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      className={`${className} overflow-hidden resize-none transition-all duration-200`}
      rows={1}
      disabled={disabled}
    />
  );
};

const MainAppInner: React.FC<{
  moduleType: ModuleType, 
  onSwitchModule: (m: ModuleType) => void, 
  apiKeys: string[], 
  onLogout: () => void, 
  onUpdateApiKeys: (keys: string[]) => void 
}> = ({ 
  moduleType, 
  onSwitchModule, 
  apiKeys, 
  onLogout, 
  onUpdateApiKeys 
}) => {
  const activeModule = moduleType;
  const [idea, setIdea] = useState(() => localStorage.getItem(`nam_app_${moduleType}_idea`) || "");
  const [isIdeaExpanded, setIsIdeaExpanded] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(() => localStorage.getItem(`nam_app_${moduleType}_theme`) || THEMES[moduleType][0].id);
  const [totalDuration, setTotalDuration] = useState(() => Number(localStorage.getItem(`nam_app_${moduleType}_duration`)) || 12);
  const [loading, setLoading] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState<GeneratedPrompt[]>(() => {
    const saved = localStorage.getItem(`nam_app_${moduleType}_prompts`);
    return saved ? JSON.parse(saved) : [];
  });
  const [error, setError] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<Record<string, boolean>>({});

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [keysInput, setKeysInput] = useState("");

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoAnalysis, setVideoAnalysis] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [productInfo, setProductInfo] = useState(() => localStorage.getItem(`nam_app_sales_product_info`) || "");
  const [productAnalysis, setProductAnalysis] = useState(() => localStorage.getItem(`nam_app_sales_product_analysis`) || "");
  const [charCount, setCharCount] = useState<1 | 2 | 3>(() => (Number(localStorage.getItem(`nam_app_${moduleType}_charCount`)) as 1 | 2 | 3) || (moduleType === 'comedy' || moduleType === 'mukbang' || moduleType === 'troll' ? 2 : 1));
  const [analyzingProduct, setAnalyzingProduct] = useState(false);

  const [charAGender, setCharAGender] = useState<'Nam' | 'Nữ'>(() => (localStorage.getItem(`nam_app_${moduleType}_charA`) as 'Nam' | 'Nữ') || 'Nam');
  const [charBGender, setCharBGender] = useState<'Nữ' | 'Nam'>(() => (localStorage.getItem(`nam_app_${moduleType}_charB`) as 'Nữ' | 'Nam') || 'Nữ');
  const [charCGender, setCharCGender] = useState<'Nam' | 'Nữ'>(() => (localStorage.getItem(`nam_app_${moduleType}_charC`) as 'Nam' | 'Nữ') || 'Nam');
  const [outfitStyle, setOutfitStyle] = useState<'default' | 'cameo'>(() => (localStorage.getItem(`nam_app_${moduleType}_outfit`) as 'default' | 'cameo') || 'default');

  // Persistence effects
  useEffect(() => { localStorage.setItem(`nam_app_${moduleType}_idea`, idea); }, [idea, moduleType]);
  useEffect(() => { localStorage.setItem(`nam_app_${moduleType}_theme`, selectedTheme); }, [selectedTheme, moduleType]);
  useEffect(() => { localStorage.setItem(`nam_app_${moduleType}_duration`, String(totalDuration)); }, [totalDuration, moduleType]);
  useEffect(() => { localStorage.setItem(`nam_app_${moduleType}_prompts`, JSON.stringify(generatedPrompts)); }, [generatedPrompts, moduleType]);
  useEffect(() => { localStorage.setItem(`nam_app_${moduleType}_charCount`, String(charCount)); }, [charCount, moduleType]);
  useEffect(() => { localStorage.setItem(`nam_app_${moduleType}_charA`, charAGender); }, [charAGender, moduleType]);
  useEffect(() => { localStorage.setItem(`nam_app_${moduleType}_charB`, charBGender); }, [charBGender, moduleType]);
  useEffect(() => { localStorage.setItem(`nam_app_${moduleType}_charC`, charCGender); }, [charCGender, moduleType]);
  useEffect(() => { localStorage.setItem(`nam_app_${moduleType}_outfit`, outfitStyle); }, [outfitStyle, moduleType]);
  useEffect(() => { localStorage.setItem(`nam_app_sales_product_info`, productInfo); }, [productInfo]);
  useEffect(() => { localStorage.setItem(`nam_app_sales_product_analysis`, productAnalysis); }, [productAnalysis]);

  const episodesCount = activeModule === 'video_clone' ? Math.max(1, Math.ceil(videoDuration / 12)) : Math.ceil(totalDuration / 12);
  const currentKeyIndexRef = useRef(0);
  const originalViTextRef = useRef<string>("");

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    setIdea("");
    setGeneratedPrompts([]);
    setVideoFile(null);
    setVideoPreviewUrl(null);
    setVideoDuration(0);
    setVideoAnalysis("");
  };

  const handleResetApp = () => {
    setIsResetConfirmOpen(true);
  };

  const confirmReset = () => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('nam_app_') && !key.startsWith('nam_app_keys') && !key.startsWith('nam_app_auth')) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    window.location.reload();
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
       if (file.size > 20 * 1024 * 1024) {
           setError("Kích thước video không được vượt quá 20MB.");
           return;
       }
       setVideoFile(file);
       setVideoPreviewUrl(URL.createObjectURL(file));
       setVideoAnalysis("");
       setGeneratedPrompts([]);
       setVideoDuration(0);
    }
  };

  const analyzeVideo = async () => {
    if (!videoFile) return;
    setAnalyzing(true);
    setError(null);
    try {
      const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
              const result = reader.result as string;
              resolve(result.split(',')[1]);
          };
          reader.onerror = error => reject(error);
      });
      const base64Data = await toBase64(videoFile);
      const response = await generateContentWithRotation({
          model: MODEL_NAME,
          contents: [
              { inlineData: { data: base64Data, mimeType: videoFile.type } },
              `Phân tích video (${videoDuration.toFixed(1)}s):
1. Diễn biến
2. Thoại (nếu có)
3. Bối cảnh, không gian, thời điểm
4. Góc máy
5. Nhân vật, trang phục
6. Hành động chi tiết từng s.`
          ],
          config: {
              systemInstruction: "Chuyên gia phân tích video. Ngắn gọn, chi tiết.",
              temperature: 0.4
          }
      });
      setVideoAnalysis(response.text || "");
    } catch (err: any) {
      console.error("Analysis Error:", err);
      setError(err.message || "Lỗi khi phân tích video. Video có thể quá lớn đối với API.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAnalyzeProduct = async () => {
    if (!productInfo.trim()) {
      setError("Vui lòng nhập thông tin sản phẩm");
      return;
    }
    if (apiKeys.length === 0) {
      setError("Vui lòng nhập Gemini API Key trong Cài đặt");
      return;
    }
    setAnalyzingProduct(true);
    setError(null);
    try {
      const response = await generateContentWithRotation({
        model: MODEL_NAME,
        contents: `Bạn là một chuyên gia marketing và bán hàng. Dựa vào thông tin sản phẩm sau, hãy phân tích nhanh 3-5 USP và đề xuất góc nhìn (angle) để làm video bán hàng hiệu quả nhất.\nThông tin sản phẩm: ${productInfo}`,
        config: {
          systemInstruction: "Chuyên gia MKT. Ngắn gọn, súc tích."
        }
      });
      setProductAnalysis(response.text || "");
    } catch (err: any) {
      setError(err.message || "Lỗi. Vui lòng thử lại.");
    } finally {
      setAnalyzingProduct(false);
    }
  };

  const openSettings = () => {
     setKeysInput(apiKeys.join('\n'));
     setIsSettingsOpen(true);
  };

  const saveSettings = () => {
     const keys = keysInput.split('\n').map(k => k.trim()).filter(k => k.length > 0);
     if (keys.length === 0) {
       alert("Vui lòng nhập ít nhất 1 API Key.");
       return;
     }
     onUpdateApiKeys(keys);
     setIsSettingsOpen(false);
  };

  const generateContentWithRotation = async (params: any) => {
    if (apiKeys.length === 0) throw new Error("Không có API Key nào được cung cấp.");
    
    let startIndex = currentKeyIndexRef.current;
    
    for (let i = 0; i < apiKeys.length; i++) {
       const indexToTry = (startIndex + i) % apiKeys.length;
       try {
         const tempAi = new GoogleGenAI({ apiKey: apiKeys[indexToTry] });
         const response = await tempAi.models.generateContent(params);
         currentKeyIndexRef.current = indexToTry;
         return response;
       } catch (error: any) {
         console.warn(`API Key at index ${indexToTry} failed:`, error);
         if (i === apiKeys.length - 1) {
            throw error;
         }
       }
    }
    throw new Error("Tất cả API Key đều lỗi hoặc hết hạn.");
  };

  const suggestIdea = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    const themeLabel = THEMES[activeModule].find(t => t.id === selectedTheme)?.label || "Mặc định";
    
    let ideaPrompt = "";
    let sysPrompt = "";

    const charListVi = charCount === 1 ? 'NAM' : charCount === 2 ? 'NAM, THƯ' : 'NAM, THƯ, HẢI';

    if (activeModule === 'action') {
      ideaPrompt = `Kịch bản võ thuật "${themeLabel}", nhân vật: ${charListVi}. Bối cảnh (Location) phải cực kỳ bám sát và giới hạn TRONG chủ đề "${themeLabel}". Đòn đánh đẹp. Cốt truyện phải liền mạch logic về không gian và tình huống. Output: text thuần.`;
      sysPrompt = "Biên kịch võ thuật. Tiếng Việt.";
    } else if (activeModule === 'comedy') {
      ideaPrompt = `Hài hước "${themeLabel}" (no action). Bối cảnh (Location) phải cực kỳ bám sát và giới hạn TRONG chủ đề "${themeLabel}". Đời thường, bá đạo. Nhân vật: ${charListVi}. Cốt truyện phải liền mạch logic về không gian và tình huống. Output: text thuần.`;
      sysPrompt = "Biên kịch hài. Tiếng Việt.";
    } else if (activeModule === 'travel') {
      ideaPrompt = `Kịch bản du lịch khám phá tự do "${themeLabel}", review cảnh đẹp, trải nghiệm văn hóa, ẩm thực. Bối cảnh bám sát chủ đề "${themeLabel}". Nhân vật: ${charListVi}. Cảnh quay mãn nhãn, điện ảnh nghệ thuật. Cốt truyện phải liền mạch logic về không gian và tình huống. Output: text thuần.`;
      sysPrompt = "Biên kịch du lịch khám phá. Tiếng Việt.";
    } else if (activeModule === 'sales') {
      ideaPrompt = `Kịch bản video bán hàng/review ngắn "${themeLabel}". Nhân vật: ${charListVi}. Bối cảnh bám sát chủ đề "${themeLabel}". Tập trung vào tính năng sản phẩm, kêu gọi hành động (CTA). Cốt truyện phải liền mạch logic về không gian và tình huống. Output: text thuần.\n\nThông tin SP: ${productInfo}\nPhân tích USP: ${productAnalysis}`;
      sysPrompt = "Biên kịch review bán hàng TikTok. Tiếng Việt.";
    } else if (activeModule === 'fashion') {
      ideaPrompt = `Kịch bản thời trang/Lookbook "${themeLabel}". Nhân vật: ${charListVi}. Bối cảnh bám sát chủ đề "${themeLabel}". Góc quay nghệ thuật, tôn dáng, phong cách thời trang ấn tượng. Cốt truyện phải liền mạch logic về không gian và tình huống. Output: text thuần.`;
      sysPrompt = "Đạo diễn hình ảnh thời trang. Tiếng Việt.";
    } else if (activeModule === 'survival_timelapse') {
      ideaPrompt = `Kịch bản Time-lapse sinh tồn "${themeLabel}". Nhân vật: ${charListVi}. Tập trung vào quá trình làm việc miệt mài, xây dựng, chế tạo cực nhanh. Góc quay cố định (static) hoặc flycam. Cốt truyện phải liền mạch logic về không gian và tình huống. Output: text thuần.`;
      sysPrompt = "Chuyên gia Time-lapse sinh tồn. Tiếng Việt.";
    } else if (activeModule === 'comedy_action') {
      ideaPrompt = `Kịch bản Hài & Hành động kết hợp "${themeLabel}". Nhân vật: ${charListVi}. Các tình huống đánh đấm cực gắt nhưng đan xen các pha tấu hài, vụng về khó đỡ. Cốt truyện phải liền mạch logic về không gian và tình huống. Output: text thuần.`;
      sysPrompt = "Biên kịch phim hành động hài. Tiếng Việt.";
    } else if (activeModule === 'troll') {
      ideaPrompt = `Kịch bản Hài Troll giữa 2-3 người chủ đề "${themeLabel}". Nhân vật: ${charListVi}. Những trò nghịch dại, nghịch ngu, trêu chọc nhau đầy bất ngờ và hài hước. Cốt truyện phải liền mạch logic về không gian và tình huống. Output: text thuần.`;
      sysPrompt = "Biên kịch kịch bản troll hài hước. Tiếng Việt.";
    } else if (activeModule === 'cooking_comedy') {
      ideaPrompt = `Kịch bản Nấu ăn & Hài hước kết hợp "${themeLabel}". Nhân vật: ${charListVi}. Bối cảnh bám sát chủ đề "${themeLabel}". Các tình huống nấu nướng nhưng xảy ra các pha tấu hài, hậu đậu, biểu cảm hài hước. Quyết tâm nấu món ngon nhưng kết cục bất ngờ. Output: text thuần.`;
      sysPrompt = "Biên kịch chương trình nấu ăn hài hước. Tiếng Việt.";
    } else if (activeModule === 'cooking') {
      ideaPrompt = `Kịch bản dạy nấu ăn/Food Vlog "${themeLabel}". Nhân vật: ${charListVi}. Bối cảnh bám sát chủ đề "${themeLabel}". Tập trung vào kỹ năng nấu nướng, âm thanh chế biến, thành phẩm hấp dẫn. Cốt truyện phải liền mạch logic về không gian và tình huống. Output: text thuần.`;
      sysPrompt = "Biên kịch chương trình ẩm thực. Tiếng Việt.";
    } else if (activeModule === 'tom_chien') {
      ideaPrompt = `Mukbang ASMR Tôm "${themeLabel}". Nhân vật: ${charListVi}. Bối cảnh (Location) phải cực kỳ bám sát và giới hạn TRONG chủ đề "${themeLabel}". Đồ ăn là món tôm hấp dẫn, ASMR chuẩn, no thoại. Cốt truyện phải liền mạch logic về không gian và tình huống. Output: text thuần.`;
      sysPrompt = "Biên kịch Mukbang Tôm. Tiếng Việt.";
    } else {
      ideaPrompt = `Mukbang ASMR "${themeLabel}". Nhân vật: ${charListVi}. Bối cảnh (Location) phải cực kỳ bám sát và giới hạn TRONG chủ đề "${themeLabel}". Đồ ăn ngon, ASMR chuẩn, no thoại. Cốt truyện phải liền mạch logic về không gian và tình huống. Output: text thuần.`;
      sysPrompt = "Biên kịch Mukbang. Tiếng Việt.";
    }

    try {
      const response = await generateContentWithRotation({
        model: MODEL_NAME,
        contents: ideaPrompt,
        config: {
          systemInstruction: sysPrompt,
          temperature: 0.8,
        }
      });
      const result = response.text || "";
      setIdea(result.replace(/[*#]/g, '').trim());
    } catch (err) {
      console.error("Gemini Error:", err);
      setError("Không thể kết nối với AI để gợi ý ý tưởng.");
    } finally {
      setLoading(false);
    }
  };

  const generateFullPrompts = async () => {
    if (activeModule === 'video_clone') {
       if (!videoAnalysis) {
          setError("Vui lòng phân tích video trước khi tạo prompt.");
          return;
       }
    } else {
       if (!idea.trim()) {
          setError("Vui lòng nhập ý tưởng kịch bản.");
          return;
       }
    }
    setLoading(true);
    setError(null);

    const themeLabel = THEMES[activeModule].find(t => t.id === selectedTheme)?.label || "Mặc định";
    
    let taskDesc = "";
    let actionDesc = "";
    let mainCharacters = "";
    let outfitDesc = "";
    let dialogDesc = "";
    let userPrompt = "";

    const formatGender = (gender: 'Nam' | 'Nữ') => gender === 'Nam' ? 'Male' : 'Female';
    const charListDesc = 
      charCount === 1 ? `NAM (${formatGender(charAGender)})` : 
      charCount === 2 ? `NAM (${formatGender(charAGender)}), THƯ (${formatGender(charBGender)})` :
      `NAM (${formatGender(charAGender)}), THƯ (${formatGender(charBGender)}), HẢI (${formatGender(charCGender)})`;
    const outfitList = 
      charCount === 1 ? 'NAM' : charCount === 2 ? 'NAM, THƯ' : 'NAM, THƯ, HẢI';
    const charListVi = charCount === 1 ? 'NAM' : charCount === 2 ? 'NAM, THƯ' : 'NAM, THƯ, HẢI';

    if (activeModule === 'action') {
      taskDesc = `Continuous martial arts, theme "${themeLabel}"`;
      actionDesc = `Action: [0-4s, 4-8s, 8-12s choreography]`;
      mainCharacters = charListDesc;
      outfitDesc = `${outfitList}: ${outfitStyle === 'cameo' ? 'Trang phục Cameo Gốc' : '[outfit]'}`;
      dialogDesc = "Dialog: [Vietnamese only]";
      userPrompt = `Make ${totalDuration}s fight (${episodesCount} parts). Idea: "${idea}". Protagonist: ${charListVi}. Flow perfectly.`;
    } else if (activeModule === 'comedy') {
      taskDesc = `Continuous comedic scene, theme "${themeLabel}"`;
      actionDesc = `Action: [0-4s, 4-8s, 8-12s comedic expressions]`;
      mainCharacters = charListDesc;
      outfitDesc = `${outfitList}: ${outfitStyle === 'cameo' ? 'Trang phục Cameo Gốc' : '[outfit]'}`;
      dialogDesc = "Dialog: [Vietnamese only]";
      userPrompt = `Make ${totalDuration}s comedy (${episodesCount} parts). Idea: "${idea}". Leads: ${charListVi}. Flow perfectly.`;
    } else if (activeModule === 'travel') {
      taskDesc = `Continuous cinematic travel vlog, theme "${themeLabel}"`;
      actionDesc = `Action: [0-4s, 4-8s, 8-12s cinematic movements, exploring scenery or interacting with local culture]`;
      mainCharacters = charListDesc;
      outfitDesc = `${outfitList}: ${outfitStyle === 'cameo' ? 'Trang phục Cameo Gốc' : '[outfit, suitable for travel theme]'}`;
      dialogDesc = "Dialog: [Vietnamese voiceover or conversational]";
      userPrompt = `Make ${totalDuration}s travel vlog (${episodesCount} parts). Idea: "${idea}". Protagonist: ${charListVi}. Focus on beautiful scenery and travel lifestyle. Flow perfectly.`;
    } else if (activeModule === 'sales') {
      taskDesc = `Continuous short-form video for product sales/review, theme "${themeLabel}"`;
      actionDesc = `Action: [0-4s hook/intro, 4-8s product showcase, 8-12s usage/CTA]`;
      mainCharacters = charListDesc;
      outfitDesc = `${outfitList}: ${outfitStyle === 'cameo' ? 'Trang phục Cameo Gốc' : '[stylish outfit, neat]'}`;
      dialogDesc = "Dialog: [Vietnamese persuasive/review lines]";
      userPrompt = `Make ${totalDuration}s sales video (${episodesCount} parts). Idea: "${idea}". Protagonist: ${charListVi}. Highlight product features clearly. Flow perfectly.\nProduct: ${productInfo}\nUSP: ${productAnalysis}`;
    } else if (activeModule === 'fashion') {
      taskDesc = `Continuous fashion lookbook/editorial video, theme "${themeLabel}"`;
      actionDesc = `Action: [0-4s dynamic pose, 4-8s outfit transition/walk, 8-12s cinematic slow-mo]`;
      mainCharacters = charListDesc;
      outfitDesc = `${outfitList}: ${outfitStyle === 'cameo' ? 'Trang phục Cameo Gốc' : '[high-fashion outfit matching theme]'}`;
      dialogDesc = "Dialog: [Minimal or aesthetic vibe (no dialog)]";
      userPrompt = `Make ${totalDuration}s fashion lookbook (${episodesCount} parts). Idea: "${idea}". Protagonist: ${charListVi}. Focus on outfit, styling, and cinematic lighting. Flow perfectly.`;
    } else if (activeModule === 'mukbang' || activeModule === 'tom_chien') {
      taskDesc = `Continuous ASMR Mukbang, theme "${themeLabel}"`;
      actionDesc = `Action: [0-4s, 4-8s, 8-12s ASMR eating]`;
      mainCharacters = charListDesc;
      outfitDesc = `${outfitList}: ${outfitStyle === 'cameo' ? 'Trang phục Cameo Gốc' : '[outfit]'}`;
      dialogDesc = "Dialog: [NONE. ASMR eating sounds only]";
      userPrompt = `Make ${totalDuration}s Mukbang (${episodesCount} parts). Idea: "${idea}". Leads: ${charListVi}. Flow perfectly.`;
    } else if (activeModule === 'survival_timelapse') {
      taskDesc = `Continuous Time-lapse survival building/crafting, theme "${themeLabel}"`;
      actionDesc = `Action: [0-4s, 4-8s, 8-12s fast-motion craftsmanship, shadows moving fast, structure growing]`;
      mainCharacters = charListDesc;
      outfitDesc = `${outfitList}: ${outfitStyle === 'cameo' ? 'Trang phục Cameo Gốc' : '[practical survival gear]'}`;
      dialogDesc = "Dialog: [NONE. Focus on tools and environment sounds]";
      userPrompt = `Make ${totalDuration}s time-lapse survival (${episodesCount} parts). Idea: "${idea}". Protagonist: ${charListVi}. Emphasize the rapid progress of construction. Flow perfectly.`;
    } else if (activeModule === 'cooking_comedy') {
      taskDesc = `Continuous Cooking-Comedy sequence, theme "${themeLabel}"`;
      actionDesc = `Action: [0-4s enthusiastic preparation, 4-8s funny cooking mistake/reaction, 8-12s hilarious dish result/tasting]`;
      mainCharacters = charListDesc;
      outfitDesc = `${outfitList}: ${outfitStyle === 'cameo' ? 'Trang phục Cameo Gốc' : '[messy apron or chef outfit]'}`;
      dialogDesc = "Dialog: [Vietnamese funny commentary or shouting/laughing]";
      userPrompt = `Make ${totalDuration}s cooking comedy video (${episodesCount} parts). Idea: "${idea}". Leads: ${charListVi}. Focus on the humorous interaction with ingredients and tools. Flow perfectly.`;
    } else if (activeModule === 'cooking') {
      taskDesc = `Continuous Cooking/Food Vlog, theme "${themeLabel}"`;
      actionDesc = `Action: [0-4s preparing ingredients, 4-8s cooking/frying/boiling, 8-12s plating/serving]`;
      mainCharacters = charListDesc;
      outfitDesc = `${outfitList}: ${outfitStyle === 'cameo' ? 'Trang phục Cameo Gốc' : '[chef or casual apron]'}`;
      dialogDesc = "Dialog: [Vietnamese cooking instructions or food remarks]";
      userPrompt = `Make ${totalDuration}s cooking video (${episodesCount} parts). Idea: "${idea}". Protagonist: ${charListVi}. Focus on the process of cooking the food, NOT EATING. Show skills like cutting, stir-frying, and beautiful results. Flow perfectly.`;
    } else if (activeModule === 'comedy_action') {
      taskDesc = `Continuous Action-Comedy sequence, theme "${themeLabel}"`;
      actionDesc = `Action: [0-4s intense combat, 4-8s funny mistake/reaction, 8-12s epic resolution with a twist]`;
      mainCharacters = charListDesc;
      outfitDesc = `${outfitList}: ${outfitStyle === 'cameo' ? 'Trang phục Cameo Gốc' : '[outfit matching the role]'}`;
      dialogDesc = "Dialog: [Vietnamese sarcastic or witty lines during fight]";
      userPrompt = `Make ${totalDuration}s action-comedy (${episodesCount} parts). Idea: "${idea}". Leads: ${charListVi}. Balanced ratio of 70% cool action, 30% laugh. Flow perfectly.`;
    } else if (activeModule === 'troll') {
      taskDesc = `Continuous Comedic Prank/Troll sequence, theme "${themeLabel}"`;
      actionDesc = `Action: [0-4s setting up the prank, 4-8s the prank execution, 8-12s the hilarious reaction/outcome]`;
      mainCharacters = charListDesc;
      outfitDesc = `${outfitList}: ${outfitStyle === 'cameo' ? 'Trang phục Cameo Gốc' : '[casual outfit]'}`;
      dialogDesc = "Dialog: [Vietnamese whispers, laughing, or shouting during prank]";
      userPrompt = `Make ${totalDuration}s troll video (${episodesCount} parts). Idea: "${idea}". Leads: ${charListVi}. Focus on the funny setup and pay-off of the prank. Flow perfectly.`;
    } else {
      taskDesc = `Recreate analyzed video exactly`;
      actionDesc = `Action: [0-4s, 4-8s, 8-12s exact actions from analysis]`;
      mainCharacters = "[From analysis]";
      outfitDesc = "[Exact clothing from analysis]";
      dialogDesc = "Dialog: [Exact from analysis or NONE]";
      userPrompt = `Analysis (${Math.round(videoDuration)}s):\n${videoAnalysis}\n\nTask: Recreate scene (${episodesCount} parts, 12s max). Match perfectly.`;
    }

    const systemPrompt = `Jimeng Prompt Eng.
Task: ${taskDesc} (${episodesCount} parts, 12s each).
Characters: ${mainCharacters}.

RULES:
1. Style, Outfit, and Lighting MUST BE IDENTICAL for ALL parts in the generated array to maintain character consistency.
2. Continuous storytelling: Each part must follow the previous one seamlessly. MANDATORY: The starting action of Part N MUST BE the ending action of Part N-1 to create a perfectly bridged sequence.
3. Plot Logic: The storyline across all parts must be coherent in terms of space, time, and situational development. The LAST part (Part ${episodesCount}) MUST conclude with a clear and definitive ending/resolution.
4. Keep Location, Time, Outfit, Lighting, SFX text EXTREMELY short and concise (reduce length by 2/3, max 2-3 words each).
5. LOCATION MUST strictly match the theme "${themeLabel}" and be diverse/specific (e.g. if prison theme, use specific spots like "prison cell", "cafeteria", "yard").
6. 12s Prompt Format:
Location: [Specific spot within theme, ultra-short]
Time: [1-2 words]
Style: Cinematic 8k (IDENTICAL for all parts).
Outfit: ${outfitDesc} (IDENTICAL for all parts, short)
Camera: track, stabilize, no cuts.
Lighting: [IDENTICAL for all parts, ultra-short]
SFX: [Ultra-short sounds]
${dialogDesc}
${actionDesc}
No text, No subs.

7. MANDATORY: The phrase "No text, No subs" MUST be appended at the very end of EVERY field: vi_prompt, en_prompt, and cn_prompt.
8. MANDATORY: Use 's' for time markers (e.g., 0-4s, 4-8s, 8-12s) in ALL prompts (vi_prompt, en_prompt, cn_prompt), NEVER use 'giây' or 'seconds'.
Format: JSON array.`;

    try {
      const finalUserPrompt = episodesCount > 1 
        ? `${userPrompt}\n\nREINFORCEMENT: Ensure Part N starts exactly where Part N-1 ended. Part ${episodesCount} must reach a final conclusion.`
        : userPrompt;

      const response = await generateContentWithRotation({
        model: MODEL_NAME,
        contents: finalUserPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.NUMBER },
                vi_prompt: { type: Type.STRING },
                en_prompt: { type: Type.STRING },
                cn_prompt: { type: Type.STRING },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["id", "vi_prompt", "en_prompt", "cn_prompt", "tags"]
            }
          }
        }
      });

      const result = JSON.parse(response.text || "[]");
      setGeneratedPrompts(result);
    } catch (err) {
      console.error("Lỗi tạo prompt:", err);
      setError("Lỗi tạo prompt kịch bản. Thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleViTextFocus = (text: string) => {
    originalViTextRef.current = text;
  };

  const handleViTextChange = (index: number, newViText: string) => {
    const updated = [...generatedPrompts];
    updated[index].vi_prompt = newViText;
    setGeneratedPrompts(updated);
  };

  const forceSyncPrompt = async (index: number, currentViText: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const updated = [...generatedPrompts];
      // Ensure Vi text has the suffix too
      const finalViText = currentViText.trim().endsWith("No text, No subs") 
        ? currentViText 
        : `${currentViText.trim()} No text, No subs`;
      updated[index].vi_prompt = finalViText;

      const response = await generateContentWithRotation({
        model: MODEL_NAME,
        contents: `Tập ${updated[index].id} (NAM${activeModule !== 'action' ? ', THƯ' : ''}): "${finalViText}". Dịch Anh, Trung (chuẩn Jimeng).`,
        config: {
          systemInstruction: "Translate Jimeng prompt. MANDATORY: The phrase 'No text, No subs' MUST be at the end of every translated string. Return JSON.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              en: { type: Type.STRING },
              cn: { type: Type.STRING }
            },
            required: ["en", "cn"]
          }
        }
      });

      const translated = JSON.parse(response.text || "{}");
      if (translated.en && translated.cn) {
        updated[index].en_prompt = translated.en;
        updated[index].cn_prompt = translated.cn;
        setGeneratedPrompts([...updated]);
        originalViTextRef.current = finalViText; 
      }
    } catch (e) {
      console.error("Sync translation error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleViTextBlur = async (index: number, currentViText: string) => {
    if (originalViTextRef.current === currentViText) {
      return; 
    }
    
    setLoading(true);
    try {
      const updated = [...generatedPrompts];
      // Ensure Vi text has the suffix too
      const finalViText = currentViText.trim().endsWith("No text, No subs") 
        ? currentViText 
        : `${currentViText.trim()} No text, No subs`;
      updated[index].vi_prompt = finalViText;

      const response = await generateContentWithRotation({
        model: MODEL_NAME,
        contents: `Tập ${updated[index].id} (NAM${activeModule !== 'action' ? ', THƯ' : ''}): "${finalViText}". Dịch Anh, Trung (chuẩn Jimeng).`,
        config: {
          systemInstruction: "Translate Jimeng prompt. MANDATORY: The phrase 'No text, No subs' MUST be at the end of every translated string. Return JSON.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              en: { type: Type.STRING },
              cn: { type: Type.STRING }
            },
            required: ["en", "cn"]
          }
        }
      });

      const translated = JSON.parse(response.text || "{}");
      if (translated.en && translated.cn) {
        updated[index].en_prompt = translated.en;
        updated[index].cn_prompt = translated.cn;
        setGeneratedPrompts([...updated]);
        originalViTextRef.current = finalViText;
      }
    } catch (e) {
      console.error("Blur translation error:", e);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus({ ...copyStatus, [key]: true });
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [key]: false }));
      }, 3000);
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 p-4 md:p-8 pb-24 font-sans selection:bg-red-600/30">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/10 pb-8">
          <div className="flex items-center gap-5">
            <motion.div 
              initial={{ rotate: -20, scale: 0.8, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              className="bg-red-600 p-4 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.4)]"
            >
              <Film size={36} className="text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white uppercase italic leading-none">
                NAM PROMPT <span className="text-red-600">MASTER</span>
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-slate-500 text-[10px] font-black tracking-[0.4em] uppercase">Professional Continuity Engine</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap bg-white/5 rounded-2xl p-2 border border-white/5 backdrop-blur-sm self-start md:self-center w-full md:w-auto justify-center md:justify-start">
             <div className="px-3 md:px-4 py-2 text-center border-r border-white/10 flex-1 md:flex-none">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Model</p>
                <p className="text-xs font-mono text-slate-300">GM-3-F</p>
             </div>
             <div className="px-3 md:px-4 py-2 text-center flex-1 md:flex-none">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Character</p>
                <p className="text-xs font-bold text-red-500">{activeModule === 'action' ? 'NAM' : activeModule === 'video_clone' ? 'Tùy biến' : 'NAM & THƯ'}</p>
             </div>
             <div className="px-3 md:px-4 flex items-center justify-center gap-3 md:gap-4 border-t md:border-t-0 md:border-l border-white/5 mt-2 md:mt-0 pt-2 md:pt-0 pb-1 md:pb-0 w-full md:w-auto">
                <button 
                  onClick={handleResetApp}
                  className="flex flex-col items-center gap-1 text-[9px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                >
                  <RefreshCw size={14} />
                  <span className="hidden xs:inline">Làm mới</span>
                  <span className="xs:hidden">Reset</span>
                </button>
                <button 
                  onClick={openSettings}
                  className="flex flex-col items-center gap-1 text-[9px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                >
                  <Key size={14} />
                  <span>Cài đặt</span>
                </button>
                <button 
                  onClick={onLogout}
                  className="flex flex-col items-center gap-1 text-[9px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                >
                  <LogOut size={14} />
                  <span>Thoát</span>
                </button>
             </div>
          </div>
        </header>

        {/* Module Selector */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 flex-wrap gap-2 md:gap-3 p-3 md:p-2 bg-[#0c0c0c] rounded-[1.5rem] md:rounded-[2rem] border border-white/5 shadow-inner">
            {MODULES.map((mod) => {
              const Icon = mod.icon;
              const isActive = activeModule === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => {
                    onSwitchModule(mod.id);
                  }}
                  className={`flex items-center justify-center gap-2 py-3 md:py-4 rounded-xl md:rounded-full font-black uppercase text-[10px] md:text-sm tracking-wider transition-all duration-300 ${
                    isActive 
                      ? 'bg-red-600 text-white shadow-[0_10px_20px_rgba(220,38,38,0.2)]'
                      : 'text-slate-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-white" : "text-slate-600"} />
                  <span className="truncate">{mod.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Theme Selector (Hidden for Video Clone) */}
        {activeModule !== 'video_clone' && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8 bg-[#0c0c0c] border border-white/5 p-6 rounded-[2rem] shadow-sm"
          >
          <div className="flex items-center gap-2 mb-4 px-2">
            <LayoutGrid size={16} className="text-red-600" />
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Chọn chủ đề {MODULES.find(m => m.id === activeModule)?.label || ''}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {THEMES[activeModule].map((theme) => {
              const Icon = theme.icon;
              const isActive = selectedTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                    isActive 
                      ? "bg-red-600 border-red-500 text-white shadow-[0_10px_20px_rgba(220,38,38,0.2)]" 
                      : "bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:border-white/10"
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-white" : "text-slate-600"} />
                  {theme.label}
                </button>
              );
            })}
          </div>
        </motion.div>
        )}

        {/* Dynamic Control Panel */}
        {activeModule === 'video_clone' ? (
          <motion.div 
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className="bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] p-6 md:p-10 mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group"
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[100px] pointer-events-none" />
             
             <div className="relative z-10 flex flex-col gap-6">
               <div className="flex items-center gap-2 mb-2">
                  <Video size={20} className="text-red-600" />
                  <h2 className="text-sm font-black text-white uppercase tracking-widest">Tải Video Mẫu & Phân Tích</h2>
               </div>
               
               <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="video/mp4,video/webm,video/quicktime" 
                  className="hidden" 
                  onChange={handleVideoUpload} 
               />
               
               {!videoFile ? (
                  <button 
                     onClick={() => fileInputRef.current?.click()}
                     className="w-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/10 rounded-3xl hover:border-red-500/50 hover:bg-white/5 transition-colors gap-4"
                  >
                     <Upload size={40} className="text-slate-500" />
                     <div className="text-center">
                        <p className="text-white font-bold mb-1">Click để tải video lên</p>
                        <p className="text-slate-500 text-xs">MPEG, MP4, WEBM (Tối đa 20MB)</p>
                     </div>
                  </button>
               ) : (
                  <div className="space-y-6">
                     <div className="relative rounded-2xl overflow-hidden bg-black/50 border border-white/10 aspect-video flex items-center justify-center">
                        <video 
                           src={videoPreviewUrl!} 
                           controls 
                           className="max-h-full max-w-full"
                           onLoadedMetadata={(e) => setVideoDuration(e.currentTarget.duration)}
                        />
                        <button 
                           onClick={() => {
                              setVideoFile(null);
                              setVideoPreviewUrl(null);
                              setVideoAnalysis("");
                              setVideoDuration(0);
                           }}
                           className="absolute top-4 right-4 bg-black/80 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                        >
                           <X size={16} />
                        </button>
                     </div>
                     
                     {!videoAnalysis && (
                        <button
                           onClick={analyzeVideo}
                           disabled={analyzing}
                           className="w-full h-[72px] bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl uppercase tracking-[0.2em] transition-all shadow-[0_10px_20px_rgba(220,38,38,0.2)] disabled:opacity-50 flex items-center justify-center gap-4 text-sm md:text-base"
                        >
                           {analyzing ? (
                              <>
                                <Scan size={20} className="animate-spin" />
                                Đang phân tích AI...
                              </>
                           ) : (
                              <>
                                <Scan size={20} />
                                AI Phân Tích Video
                              </>
                           )}
                        </button>
                     )}
                  </div>
               )}
               
               {videoAnalysis && (
                  <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="space-y-6 mt-2 pt-6 border-t border-white/5">
                     <div className="flex justify-between items-center">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kết quả phân tích</h3>
                        <span className="text-[10px] font-black text-red-500/80 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20 uppercase tracking-widest">
                           Thời lượng: {videoDuration.toFixed(1)}s = {episodesCount} Tập
                        </span>
                     </div>
                     <textarea 
                        value={videoAnalysis}
                        onChange={e => setVideoAnalysis(e.target.value)}
                        className="w-full h-48 bg-black/50 border border-white/5 rounded-2xl p-6 text-slate-300 text-sm focus:outline-none focus:border-red-500/50 shadow-inner"
                     />
                     <button
                        onClick={generateFullPrompts}
                        disabled={loading}
                        className="w-full h-[72px] bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl uppercase tracking-[0.2em] transition-all shadow-[0_10px_20px_rgba(220,38,38,0.2)] flex items-center justify-center gap-4 text-sm md:text-base"
                     >
                        {loading ? (
                           <>
                              <Wand2 size={20} className="animate-spin" />
                              Đang múa bút...
                           </>
                        ) : (
                           <>
                              <Wand2 size={20} />
                              Tạo {episodesCount} Prompt Liên Tiếp
                           </>
                        )}
                     </button>
                  </motion.div>
               )}
             </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] p-6 md:p-10 mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group"
          >
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[100px] pointer-events-none" />
          
          <div className="flex flex-col gap-8 relative z-10">
            <div 
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group/header"
              onClick={() => setIsIdeaExpanded(!isIdeaExpanded)}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${isIdeaExpanded ? 'bg-red-600/10' : 'bg-white/5'}`}>
                  <MoveHorizontal size={18} className={isIdeaExpanded ? 'text-red-600' : 'text-slate-500'} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    Kịch bản gốc
                    <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded text-slate-400 font-normal ml-2">
                      {isIdeaExpanded ? "Thu gọn" : "Bấm xem toàn bộ"}
                    </span>
                    <ChevronRight 
                      size={16} 
                      className={`text-slate-600 transition-transform duration-300 ${isIdeaExpanded ? 'rotate-90' : ''}`} 
                    />
                  </h2>
                  {!isIdeaExpanded && idea && (
                    <p className="text-[10px] text-slate-500 truncate max-w-[200px] md:max-w-md italic mt-0.5">
                      {idea}
                    </p>
                  )}
                  {!idea && !isIdeaExpanded && <p className="text-[10px] text-slate-600 mt-0.5 uppercase tracking-wider">Chưa có kịch bản...</p>}
                </div>
              </div>
              
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={suggestIdea}
                  disabled={loading}
                  className="group/btn flex items-center gap-2 text-[9px] font-black text-white bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full border border-white/10 transition-all uppercase tracking-wider disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw size={12} className="animate-spin text-slate-400" />
                  ) : (
                    <Sparkles size={12} className="text-yellow-500 group-hover/btn:scale-110 transition-transform" />
                  )}
                  {loading ? "Đang gợi ý..." : "Gợi ý"}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {isIdeaExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                  animate={{ height: "auto", opacity: 1, marginBottom: 0 }}
                  exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                  className="overflow-hidden space-y-4"
                >
                  <div className="relative pt-2">
                    <AutoResizeTextarea
                      value={idea}
                      onChange={(e) => setIdea(e.target.value)}
                      placeholder="Ví dụ: Nam đối đầu với 10 sát thủ trong ngôi đền cổ giữa rừng mưa..."
                      className="w-full bg-black/50 border border-white/5 rounded-[1.5rem] p-6 min-h-[120px] focus:ring-2 focus:ring-red-600/50 focus:border-red-600/50 outline-none text-slate-200 transition-all text-sm font-medium leading-relaxed placeholder:text-slate-700 shadow-inner"
                      disabled={loading}
                    />
                  </div>

                  {activeModule === 'sales' && (
                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Thông tin sản phẩm</label>
                        <AutoResizeTextarea
                          value={productInfo}
                          onChange={(e) => setProductInfo(e.target.value)}
                          placeholder="Nhập mô tả sản phẩm, tính năng, giá bán, ưu đãi..."
                          className="w-full bg-black/50 border border-white/5 rounded-[1.5rem] p-6 min-h-[80px] focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600/50 outline-none text-slate-200 transition-all text-sm font-medium leading-relaxed placeholder:text-slate-700 shadow-inner"
                        />
                      </div>
                      <button
                        onClick={handleAnalyzeProduct}
                        disabled={analyzingProduct || !productInfo.trim()}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-500 rounded-xl font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500/20 w-full sm:w-auto"
                      >
                        {analyzingProduct ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        {analyzingProduct ? "Đang phân tích..." : "AI Phân tích USP"}
                      </button>

                      {productAnalysis && (
                        <div className="mt-4 p-5 bg-blue-900/10 border border-blue-500/20 rounded-2xl">
                          <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Check size={14} /> Điểm mạnh USP (Sẽ dùng tạo kịch bản)
                          </h4>
                          <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">{productAnalysis}</p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 pb-2 border-b border-white/5">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Số lượng nhân vật</label>
                <div className="flex gap-2">
                  <button onClick={() => setCharCount(1)} className={`flex-1 py-3 text-xs font-bold rounded-xl transition-colors border p-2 ${charCount === 1 ? 'bg-red-600/20 text-red-500 border-red-500/50' : 'bg-black/40 text-slate-500 border-white/5 hover:bg-white/5'}`}>1</button>
                  <button onClick={() => setCharCount(2)} className={`flex-1 py-3 text-xs font-bold rounded-xl transition-colors border p-2 ${charCount === 2 ? 'bg-red-600/20 text-red-500 border-red-500/50' : 'bg-black/40 text-slate-500 border-white/5 hover:bg-white/5'}`}>2</button>
                  <button onClick={() => setCharCount(3)} className={`flex-1 py-3 text-xs font-bold rounded-xl transition-colors border p-2 ${charCount === 3 ? 'bg-red-600/20 text-red-500 border-red-500/50' : 'bg-black/40 text-slate-500 border-white/5 hover:bg-white/5'}`}>3</button>
                </div>
              </div>
              <div className="col-span-1 md:col-span-3">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Giới tính nhân vật</label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex flex-col gap-1 min-w-[120px]">
                    <span className="text-[10px] text-slate-400">NAM</span>
                    <div className="flex gap-2">
                      <button onClick={() => setCharAGender('Nam')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors border ${charAGender === 'Nam' ? 'bg-red-600/20 text-red-500 border-red-500/50' : 'bg-black/40 text-slate-500 border-white/5 hover:bg-white/5'}`}>Nam</button>
                      <button onClick={() => setCharAGender('Nữ')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors border ${charAGender === 'Nữ' ? 'bg-red-600/20 text-red-500 border-red-500/50' : 'bg-black/40 text-slate-500 border-white/5 hover:bg-white/5'}`}>Nữ</button>
                    </div>
                  </div>
                  {charCount >= 2 && (
                    <div className="flex flex-col gap-1 min-w-[120px]">
                      <span className="text-[10px] text-slate-400">THƯ</span>
                      <div className="flex gap-2">
                        <button onClick={() => setCharBGender('Nam')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors border ${charBGender === 'Nam' ? 'bg-red-600/20 text-red-500 border-red-500/50' : 'bg-black/40 text-slate-500 border-white/5 hover:bg-white/5'}`}>Nam</button>
                        <button onClick={() => setCharBGender('Nữ')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors border ${charBGender === 'Nữ' ? 'bg-red-600/20 text-red-500 border-red-500/50' : 'bg-black/40 text-slate-500 border-white/5 hover:bg-white/5'}`}>Nữ</button>
                      </div>
                    </div>
                  )}
                  {charCount >= 3 && (
                    <div className="flex flex-col gap-1 min-w-[120px]">
                      <span className="text-[10px] text-slate-400">HẢI</span>
                      <div className="flex gap-2">
                        <button onClick={() => setCharCGender('Nam')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors border ${charCGender === 'Nam' ? 'bg-red-600/20 text-red-500 border-red-500/50' : 'bg-black/40 text-slate-500 border-white/5 hover:bg-white/5'}`}>Nam</button>
                        <button onClick={() => setCharCGender('Nữ')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors border ${charCGender === 'Nữ' ? 'bg-red-600/20 text-red-500 border-red-500/50' : 'bg-black/40 text-slate-500 border-white/5 hover:bg-white/5'}`}>Nữ</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 pb-2 border-b border-white/5">
              <div>
                 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Trang phục</label>
                 <div className="flex gap-2">
                     <button onClick={() => setOutfitStyle('default')} className={`flex-1 py-3 text-[10px] font-bold rounded-xl transition-colors border p-2 ${outfitStyle === 'default' ? 'bg-red-600/20 text-red-500 border-red-500/50' : 'bg-black/40 text-slate-500 border-white/5 hover:bg-white/5'}`}>Mặc định</button>
                     <button onClick={() => setOutfitStyle('cameo')} className={`flex-1 py-3 text-[10px] font-bold rounded-xl transition-colors border p-2 ${outfitStyle === 'cameo' ? 'bg-red-600/20 text-red-500 border-red-500/50' : 'bg-black/40 text-slate-500 border-white/5 hover:bg-white/5'}`}>Cameo Gốc</button>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end mt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-end px-2">
                  <div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Thời lượng video</span>
                    <span className="text-xs text-slate-600 italic">Jimeng khuyến nghị 12s cho mỗi tập phim</span>
                  </div>
                  <div className="text-right">
                    <span className="text-red-600 font-black text-xl">{totalDuration}s</span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter block whitespace-nowrap">{episodesCount} TẬP LIÊN TIẾP</span>
                  </div>
                </div>
                <div className="flex bg-black/40 rounded-3xl border border-white/5 p-2 gap-2">
                  <button 
                    onClick={() => setTotalDuration(Math.max(12, totalDuration - 12))} 
                    className="flex-1 py-5 hover:bg-white/5 rounded-2xl transition-all flex flex-col items-center gap-1 group/dec"
                    title="Giảm 12s"
                  >
                    <Minus size={20} className="group-hover/dec:scale-125 transition-transform" />
                    <span className="text-[9px] font-bold uppercase text-slate-500">- 12s</span>
                  </button>
                  <button 
                    onClick={() => setTotalDuration(totalDuration + 12)} 
                    className="flex-1 py-5 hover:bg-red-600/10 rounded-2xl transition-all text-red-500 flex flex-col items-center gap-1 group/inc"
                    title="Thêm 12s"
                  >
                    <Plus size={20} className="group-hover/inc:scale-125 transition-transform" />
                    <span className="text-[9px] font-bold uppercase text-red-600/50 group-hover/inc:text-red-600">+ 12s</span>
                  </button>
                </div>
              </div>

              <button 
                onClick={generateFullPrompts}
                disabled={loading || !idea}
                className="group relative w-full h-[72px] overflow-hidden rounded-2xl transition-all shadow-[0_20px_40px_-15px_rgba(220,38,38,0.3)]"
              >
                <div className="absolute inset-0 bg-red-600 group-hover:bg-red-500 group-disabled:bg-slate-900 transition-colors" />
                <div className="absolute inset-0 flex justify-center items-center gap-4 text-white z-10">
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <RefreshCw size={24} className="animate-spin" />
                      <span className="font-black uppercase tracking-[0.2em] text-sm md:text-base">Đang tạo....</span>
                    </div>
                  ) : (
                    <>
                      <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      <span className="font-black uppercase tracking-[0.2em] text-sm md:text-base">Tạo Prompt</span>
                    </>
                  )}
                </div>
                {/* Button shine effect */}
                <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] group-hover:animate-[shine_1.5s_infinite]" />
              </button>
            </div>
          </div>
        </motion.div>
        )}

        {/* Results Container */}
        <div className="space-y-16 mb-40">
          <AnimatePresence mode="popLayout">
            {generatedPrompts.map((item, idx) => (
              <motion.div 
                key={item.id} 
                initial={{ scale: 0.95, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group/item bg-[#0a0a0a] border border-white/5 rounded-[2rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl relative"
              >
                {/* Phase Badge */}
                <div className="bg-[#141414] p-6 md:p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 px-8 md:px-12">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-600 blur-xl opacity-30 group-hover/item:opacity-60 transition-opacity" />
                      <span className="relative bg-red-600 text-white text-[10px] font-black px-6 py-2.5 rounded-full uppercase tracking-widest italic shadow-xl">
                        Tập {item.id}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-300 text-xs font-black uppercase tracking-widest">Hành động liên hoàn</span>
                      <span className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.1em]">Continuity Segment • High Precision</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {item.tags?.map(t => (
                      <span key={t} className="text-[9px] bg-white/5 px-4 py-1.5 rounded-full text-slate-400 font-black border border-white/10 uppercase tracking-tighter">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 md:p-14 space-y-12 md:space-y-16">
                  {/* Vietnamese Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                        <span className="w-8 h-px bg-slate-800" />
                        <Languages size={14} className="text-blue-500" /> 
                        Nội dung kịch bản (Tiếng Việt)
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => forceSyncPrompt(idx, item.vi_prompt)}
                          disabled={loading}
                          className="text-[10px] font-black px-4 md:px-8 py-3 rounded-2xl transition-all flex items-center gap-2 border bg-blue-600/20 text-blue-400 border-blue-500/30 hover:bg-blue-600 hover:text-white hover:border-blue-500 disabled:opacity-50"
                        >
                           {loading ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16}/>}
                           {loading ? "ĐANG ĐỒNG BỘ..." : "ĐỒNG BỘ"}
                        </button>
                        <button 
                          onClick={() => copyToClipboard(item.vi_prompt, `${idx}_vi`)}
                          className={`text-[10px] font-black px-4 md:px-8 py-3 rounded-2xl transition-all flex items-center gap-2 border ${
                            copyStatus[`${idx}_vi`] 
                            ? "bg-green-600 text-white border-green-500" 
                            : "bg-black text-slate-400 border-white/10 hover:border-white/20 hover:text-white"
                          }`}
                        >
                           {copyStatus[`${idx}_vi`] ? <><Check size={16}/> ĐÃ SAO CHÉP</> : <><Copy size={16}/> COPY TIẾNG VIỆT</>}
                        </button>
                      </div>
                    </div>
                    <AutoResizeTextarea
                      value={item.vi_prompt}
                      onFocus={() => handleViTextFocus(item.vi_prompt)}
                      onChange={(e) => handleViTextChange(idx, e.target.value)}
                      onBlur={(e) => handleViTextBlur(idx, e.target.value)}
                      placeholder="..."
                      className="w-full bg-black/30 border border-white/5 rounded-[1.5rem] p-6 text-sm md:text-base text-slate-200 italic focus:border-red-600/30 focus:bg-black/50 outline-none transition-all leading-relaxed shadow-inner"
                    />
                  </div>

                  {/* English Section - PRIMARY OUTPUT */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center px-2">
                      <div className="flex items-center gap-3 text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">
                        <span className="w-8 h-px bg-red-900/50" />
                        <Target size={14} /> 
                        Jimeng English AI Prompt
                      </div>
                      <button 
                        onClick={() => copyToClipboard(item.en_prompt, `${idx}_en`)}
                        className={`text-[10px] font-black px-4 md:px-8 py-3 rounded-2xl transition-all flex items-center gap-2 shadow-lg ${
                          copyStatus[`${idx}_en`] 
                          ? "bg-green-600 text-white border-green-500 animate-bounce" 
                          : "bg-white text-black hover:bg-slate-200"
                        }`}
                      >
                        {copyStatus[`${idx}_en`] ? <><Check size={16}/> COPIED</> : <><Copy size={16}/> COPY ENGLISH</>}
                      </button>
                    </div>
                    <div className="group/code relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-red-600/10 to-blue-600/10 rounded-[1.5rem] blur opacity-0 group-hover/code:opacity-100 transition-opacity" />
                      <div className="relative bg-black p-6 rounded-[1.5rem] border border-white/5 min-h-[140px] text-xs font-mono text-green-400/80 leading-relaxed whitespace-pre-wrap shadow-2xl">
                        <div className="absolute top-4 right-8 opacity-20 text-[9px] font-bold">RAW PAYLOAD</div>
                        {item.en_prompt}
                      </div>
                    </div>
                  </div>

                  {/* Chinese Section */}
                  <div className="space-y-6 opacity-80 hover:opacity-100 transition-opacity">
                    <div className="flex justify-between items-center px-2">
                      <div className="flex items-center gap-3 text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">
                        <span className="w-8 h-px bg-blue-900/30" />
                        <Languages size={14} /> 
                        Jimeng Chinese AI Prompt (中文)
                      </div>
                      <button 
                        onClick={() => copyToClipboard(item.cn_prompt, `${idx}_cn`)}
                        className={`text-[10px] font-black px-4 md:px-8 py-3 rounded-2xl transition-all flex items-center gap-2 border ${
                          copyStatus[`${idx}_cn`] 
                          ? "bg-green-600 text-white border-green-500" 
                          : "bg-black text-slate-400 border-white/10 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {copyStatus[`${idx}_cn`] ? <><Check size={16}/> 已复制</> : <><Copy size={16}/> COPY CHINESE</>}
                      </button>
                    </div>
                    <div className="bg-black/80 p-6 rounded-[1.5rem] border border-white/5 min-h-[120px] text-xs font-mono text-blue-400/70 leading-relaxed whitespace-pre-wrap shadow-inner mb-4">
                      {item.cn_prompt}
                    </div>
                  </div>

                  {/* Bottom Tech Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-white/10">
                    <div className="flex flex-col gap-3 p-6 bg-white/[0.02] rounded-3xl border border-white/5 hover:bg-white/[0.05] transition-colors group/tech">
                      <Sun size={20} className="text-orange-500 group-hover/tech:rotate-45 transition-transform"/>
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Lighting</p>
                        <p className="text-[11px] font-bold text-slate-300">Locked Global</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 p-6 bg-white/[0.02] rounded-3xl border border-white/5 hover:bg-white/[0.05] transition-colors group/tech">
                      <Volume2 size={20} className="text-blue-500 group-hover/tech:scale-110 transition-transform"/>
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">SFX Sync</p>
                        <p className="text-[11px] font-bold text-slate-300">Phase Match</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 p-6 bg-white/[0.02] rounded-3xl border border-white/5 hover:bg-white/[0.05] transition-colors group/tech">
                      <Zap size={20} className="text-yellow-500 group-hover/tech:animate-pulse"/>
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Character</p>
                        <p className="text-[11px] font-bold text-red-500">NAM Linked</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 p-6 bg-white/[0.02] rounded-3xl border border-white/5 hover:bg-white/[0.05] transition-colors group/tech">
                      <Film size={20} className="text-red-500 group-hover/tech:-translate-y-1 transition-transform"/>
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sequence</p>
                        <p className="text-[11px] font-bold text-slate-300">Part {item.id} of {episodesCount}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Continuity arrows between cards */}
                {idx < generatedPrompts.length - 1 && (
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-20">
                    <motion.div 
                      animate={{ y: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="bg-red-600 p-2 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)]"
                    >
                      <ChevronRight size={24} className="rotate-90 text-white" />
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Floating Error Toast */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 50, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 50, x: "-50%" }}
              className="fixed bottom-10 left-1/2 bg-red-600 text-white px-8 py-5 rounded-[2rem] shadow-[0_10px_40px_rgba(220,38,38,0.5)] font-black text-sm z-[100] flex items-center gap-4 border border-white/20 backdrop-blur-xl"
            >
              <AlertCircle size={24} />
              {error}
              <button 
                onClick={() => setError(null)}
                className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full transition-colors"
              >
                <Plus size={16} className="rotate-45" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Helper footer */}
        {!generatedPrompts.length && !loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            className="text-center pb-20"
          >
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.5em] mb-4">Jimeng Continuity Protocol • v1.0.4</p>
            <div className="flex justify-center gap-10">
               <div className="flex items-center gap-2 text-[9px] uppercase font-black text-slate-700">
                  <div className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
                  No Frames Cut
               </div>
               <div className="flex items-center gap-2 text-[9px] uppercase font-black text-slate-700">
                  <div className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
                  Physics Validated
               </div>
               <div className="flex items-center gap-2 text-[9px] uppercase font-black text-slate-700">
                  <div className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
                  {activeModule === 'action' ? 'NAM Consistency' : activeModule === 'video_clone' ? 'Video Consistency' : 'NAM & THƯ Consistency'}
               </div>
            </div>
          </motion.div>
        )}

        {/* Global Loading Overlay Removed */}

        {/* Settings Modal */}
        <AnimatePresence>
          {isSettingsOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-lg bg-[#0c0c0c] border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-2xl relative"
              >
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-red-600/20 p-2 rounded-xl">
                     <Key size={20} className="text-red-500" />
                  </div>
                  <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Quản lý API Key</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                       <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">API KEY (Gemini)</label>
                       <a href="https://aistudio.google.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                          Lấy API KEY miễn phí <ExternalLink size={10} />
                       </a>
                    </div>
                    <textarea 
                      value={keysInput}
                      onChange={e => setKeysInput(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors font-mono text-xs placeholder:text-slate-700 resize-none"
                      placeholder="Nhập API Key... Mỗi key 1 dòng."
                      rows={6}
                    />
                  </div>
                  
                  <button 
                    onClick={saveSettings}
                    className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-xl uppercase tracking-widest transition-colors shadow-[0_10px_20px_rgba(220,38,38,0.2)]"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reset Confirmation Modal */}
        <AnimatePresence>
          {isResetConfirmOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-md bg-[#111111] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative text-center"
              >
                <div className="flex justify-center mb-6">
                  <div className="bg-red-600/20 p-4 rounded-full">
                     <RefreshCw size={32} className="text-red-500" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">Xác nhận làm mới?</h2>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                  Bạn có chắc chắn muốn xóa toàn bộ dữ liệu thao tác? 
                  <br />
                  <span className="text-red-500/80 font-bold uppercase text-[10px] tracking-widest mt-2 block">Lưu ý: API Key sẽ được giữ lại.</span>
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setIsResetConfirmOpen(false)}
                    className="py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest transition-all"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    onClick={confirmReset}
                    className="py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest transition-all shadow-lg shadow-red-600/20"
                  >
                    Xác nhận
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shine {
          0% { left: -100%; }
          50% { left: 100%; }
          100% { left: 100%; }
        }
      `}} />
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: (keys: string[]) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keysInput, setKeysInput] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "Admin" && password === "6789") {
      const keys = keysInput.split('\n').map(k => k.trim()).filter(k => k.length > 0);
      if (keys.length === 0) {
        setError("Vui lòng nhập ít nhất 1 API Key.");
        return;
      }
      onLogin(keys);
    } else {
      setError("Tên đăng nhập hoặc mật khẩu không đúng.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 pb-24 selection:bg-red-600/30 font-sans">
      <div className="w-full max-w-md bg-[#0c0c0c] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex justify-center mb-8">
             <div className="bg-red-600 p-4 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.4)]">
                <Film size={36} className="text-white" />
             </div>
          </div>
          <h2 className="text-3xl font-black text-center text-white mb-2 uppercase italic tracking-tighter">NAM PROMPT MASTER</h2>
          <p className="text-center text-slate-500 text-xs uppercase tracking-widest mb-8">Đăng nhập hệ thống</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Tên đăng nhập</label>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                placeholder="Nhập tên đăng nhập..."
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Mật khẩu</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                placeholder="Nhập mật khẩu..."
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">API KEY (Gemini)</label>
                 <a href="https://aistudio.google.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                    Lấy API KEY miễn phí <ExternalLink size={10} />
                 </a>
              </div>
              <textarea 
                value={keysInput}
                onChange={e => setKeysInput(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors font-mono text-xs placeholder:text-slate-700 resize-none"
                placeholder="Nhập API Key... Mỗi key 1 dòng. Hệ thống sẽ tự động chuyển key nếu lỗi."
                rows={4}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-xl flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-xl uppercase tracking-widest transition-colors shadow-[0_10px_20px_rgba(220,38,38,0.2)]"
            >
              Đăng nhập
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
             <p className="text-slate-400 text-xs leading-relaxed">
               Liên hệ <span className="text-white font-bold">Nam Admin</span> để có thông tin tài khoản đăng nhập:<br/>
               <span className="inline-block mt-3 bg-white/5 px-4 py-1.5 rounded-full text-white font-mono border border-white/10 tracking-widest text-xs shadow-inner">Zalo: 0981028794</span>
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function MainApp({ apiKeys, onLogout, onUpdateApiKeys }: { apiKeys: string[], onLogout: () => void, onUpdateApiKeys: (keys: string[]) => void }) {
  const [currentModule, setCurrentModule] = useState<ModuleType>(() => {
    const saved = localStorage.getItem('nam_app_current_module');
    return (saved as ModuleType) || 'action';
  });

  const handleSwitchModule = (mod: ModuleType) => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('nam_app_action_') || 
                    key.startsWith('nam_app_comedy_') || 
                    key.startsWith('nam_app_mukbang_') || 
                    key.startsWith('nam_app_video_'))) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));

    setCurrentModule(mod);
    localStorage.setItem('nam_app_current_module', mod);
  };

  return (
    <>
      <MainAppInner 
        key={currentModule}
        moduleType={currentModule}
        onSwitchModule={handleSwitchModule}
        apiKeys={apiKeys}
        onLogout={onLogout}
        onUpdateApiKeys={onUpdateApiKeys}
      />
    </>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('nam_app_auth') === 'true';
  });
  const [apiKeys, setApiKeys] = useState<string[]>(() => {
    try {
      const storedKeys = localStorage.getItem('nam_app_keys');
      return storedKeys ? JSON.parse(storedKeys) : [];
    } catch (e) {
      return [];
    }
  });

  const handleLogin = (keys: string[]) => {
    setApiKeys(keys);
    setIsAuthenticated(true);
    localStorage.setItem('nam_app_auth', 'true');
    localStorage.setItem('nam_app_keys', JSON.stringify(keys));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setApiKeys([]);
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('nam_app_')) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  };

  const handleUpdateApiKeys = (keys: string[]) => {
    setApiKeys(keys);
    localStorage.setItem('nam_app_keys', JSON.stringify(keys));
  };

  return (
    <>
      {!isAuthenticated ? (
         <LoginScreen onLogin={handleLogin} />
      ) : (
         <MainApp apiKeys={apiKeys} onLogout={handleLogout} onUpdateApiKeys={handleUpdateApiKeys} />
      )}

      {/* Pinned Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-[100] bg-black/80 backdrop-blur-md border-t border-white/5 py-3 md:py-4 px-6 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-2 md:gap-4">
           <div className="flex items-center gap-2 px-4 py-1.5 bg-red-600/10 border border-red-500/20 rounded-full">
             <MessageCircle size={14} className="text-red-500" />
             <span className="text-[10px] md:text-xs font-black text-slate-300 uppercase tracking-widest whitespace-nowrap">
               Liên hệ hỗ trợ: <span className="text-white">Nam 0981028794</span>
             </span>
           </div>
        </div>
      </footer>
    </>
  );
}
