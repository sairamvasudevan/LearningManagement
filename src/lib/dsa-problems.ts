export type DsaProblem = {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  sampleTestCases: {
    input: string;
    expectedOutput: string;
    explanation?: string;
  }[];
  hiddenTestCases: {
    input: string;
    expectedOutput: string;
  }[];
  starterTemplates: {
    c: string;
    cpp: string;
    java: string;
    python: string;
  };
};

export const DSA_PROBLEMS: DsaProblem[] = [
  {
    id: "two-sum",
    title: "Two Sum (Target Pair Indices)",
    difficulty: "Easy",
    topic: "Arrays & Hash Table",
    description:
      "Given an array of integers `nums` and an integer `target`, return the 0-based indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. Print the two indices separated by a space in ascending order.",
    inputFormat:
      "First line contains N (number of elements) and target.\nSecond line contains N space-separated integers representing nums.",
    outputFormat: "Print the two 0-based indices separated by a space (e.g., '0 1').",
    constraints: [
      "2 <= N <= 10^5",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Exactly one valid answer exists.",
    ],
    sampleTestCases: [
      {
        input: "4 9\n2 7 11 15",
        expectedOutput: "0 1",
        explanation: "nums[0] + nums[1] = 2 + 7 = 9. Output is 0 1.",
      },
      {
        input: "3 6\n3 2 4",
        expectedOutput: "1 2",
        explanation: "nums[1] + nums[2] = 2 + 4 = 6. Output is 1 2.",
      },
      {
        input: "2 6\n3 3",
        expectedOutput: "0 1",
        explanation: "nums[0] + nums[1] = 3 + 3 = 6. Output is 0 1.",
      },
    ],
    hiddenTestCases: [
      {
        input: "5 10\n1 4 3 7 8",
        expectedOutput: "2 3",
      },
      {
        input: "6 0\n-3 4 3 90 2 -1",
        expectedOutput: "0 2",
      },
      {
        input: "4 100\n10 20 30 70",
        expectedOutput: "2 3",
      },
    ],
    starterTemplates: {
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    long long target;
    if (scanf("%d %lld", &n, &target) != 2) return 0;

    long long *nums = (long long *)malloc(sizeof(long long) * n);
    for (int i = 0; i < n; i++) {
        scanf("%lld", &nums[i]);
    }

    // TODO: Write your solution here
    // Find two distinct indices i and j such that nums[i] + nums[j] == target
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] + nums[j] == target) {
                printf("%d %d\\n", i, j);
                free(nums);
                return 0;
            }
        }
    }

    free(nums);
    return 0;
}
`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    long long target;
    if (!(cin >> n >> target)) return 0;

    vector<long long> nums(n);
    for (int i = 0; i < n; i++) {
        cin >> nums[i];
    }

    // TODO: Write O(N) Hash Map solution here
    unordered_map<long long, int> seen;
    for (int i = 0; i < n; i++) {
        long long complement = target - nums[i];
        if (seen.find(complement) != seen.end()) {
            cout << seen[complement] << " " << i << "\\n";
            return 0;
        }
        seen[nums[i]] = i;
    }

    return 0;
}
`,
      java: `import java.util.Scanner;
import java.util.HashMap;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;

        int n = sc.nextInt();
        long target = sc.nextLong();
        long[] nums = new long[n];
        for (int i = 0; i < n; i++) {
            nums[i] = sc.nextLong();
        }

        // TODO: Hash Map solution for O(N) time complexity
        HashMap<Long, Integer> map = new HashMap<>();
        for (int i = 0; i < n; i++) {
            long complement = target - nums[i];
            if (map.containsKey(complement)) {
                System.out.println(map.get(complement) + " " + i);
                return;
            }
            map.put(nums[i], i);
        }
    }
}
`,
      python: `import sys

def solve():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    
    n = int(input_data[0])
    target = int(input_data[1])
    nums = [int(x) for x in input_data[2:2 + n]]

    # Hash table for O(N) single-pass lookup
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            print(f"{seen[complement]} {i}")
            return
        seen[num] = i

if __name__ == "__main__":
    solve()
`,
    },
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses Invariant",
    difficulty: "Easy",
    topic: "Stacks & Invariants",
    description:
      "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.\n\nOutput `true` if valid, otherwise `false`.",
    inputFormat: "A single line containing the bracket string `s`.",
    outputFormat: "Print 'true' or 'false'.",
    constraints: ["1 <= s.length <= 10^5", "s consists of parentheses only '()[]{}'."],
    sampleTestCases: [
      {
        input: "()[]{}",
        expectedOutput: "true",
        explanation: "All brackets close in the correct order.",
      },
      {
        input: "(]",
        expectedOutput: "false",
        explanation: "Mismatched bracket type.",
      },
      {
        input: "([)]",
        expectedOutput: "false",
        explanation: "Interleaved brackets violate LIFO stack ordering.",
      },
      {
        input: "{[]}",
        expectedOutput: "true",
        explanation: "Nested brackets match properly.",
      },
    ],
    hiddenTestCases: [
      {
        input: "(((((((((())))))))))",
        expectedOutput: "true",
      },
      {
        input: "]",
        expectedOutput: "false",
      },
      {
        input: "((((",
        expectedOutput: "false",
      },
    ],
    starterTemplates: {
      c: `#include <stdio.h>
#include <string.h>
#include <stdbool.h>

bool isValid(char* s) {
    int n = strlen(s);
    char stack[100005];
    int top = -1;

    for (int i = 0; i < n; i++) {
        char c = s[i];
        if (c == '(' || c == '{' || c == '[') {
            stack[++top] = c;
        } else {
            if (top == -1) return false;
            char open = stack[top--];
            if (c == ')' && open != '(') return false;
            if (c == '}' && open != '{') return false;
            if (c == ']' && open != '[') return false;
        }
    }
    return top == -1;
}

int main() {
    char s[100005];
    if (scanf("%s", s) != 1) return 0;
    printf("%s\\n", isValid(s) ? "true" : "false");
    return 0;
}
`,
      cpp: `#include <iostream>
#include <string>
#include <stack>

using namespace std;

bool isValid(const string& s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') {
            st.push(c);
        } else {
            if (st.empty()) return false;
            char top = st.top();
            st.pop();
            if (c == ')' && top != '(') return false;
            if (c == '}' && top != '{') return false;
            if (c == ']' && top != '[') return false;
        }
    }
    return st.empty();
}

int main() {
    string s;
    if (cin >> s) {
        cout << (isValid(s) ? "true" : "false") << "\\n";
    }
    return 0;
}
`,
      java: `import java.util.Scanner;
import java.util.Stack;

public class Solution {
    public static boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '{' || c == '[') {
                stack.push(c);
            } else {
                if (stack.isEmpty()) return false;
                char top = stack.pop();
                if (c == ')' && top != '(') return false;
                if (c == '}' && top != '{') return false;
                if (c == ']' && top != '[') return false;
            }
        }
        return stack.isEmpty();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNext()) {
            String s = sc.next();
            System.out.println(isValid(s) ? "true" : "false");
        }
    }
}
`,
      python: `import sys

def is_valid(s: str) -> bool:
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return len(stack) == 0

def main():
    s = sys.stdin.read().strip()
    if s:
        print("true" if is_valid(s) else "false")

if __name__ == "__main__":
    main()
`,
    },
  },
  {
    id: "maximum-subarray",
    title: "Maximum Subarray (Kadane's Algorithm)",
    difficulty: "Medium",
    topic: "Arrays & Dynamic Programming",
    description:
      "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.\n\nA subarray is a contiguous non-empty sequence of elements within an array.",
    inputFormat:
      "First line contains N.\nSecond line contains N space-separated integers.",
    outputFormat: "Print the maximum subarray sum.",
    constraints: ["1 <= N <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    sampleTestCases: [
      {
        input: "9\n-2 1 -3 4 -1 2 1 -5 4",
        expectedOutput: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum 6.",
      },
      {
        input: "1\n1",
        expectedOutput: "1",
        explanation: "The subarray [1] has sum 1.",
      },
      {
        input: "5\n5 4 -1 7 8",
        expectedOutput: "23",
        explanation: "The entire array has sum 23.",
      },
    ],
    hiddenTestCases: [
      {
        input: "5\n-1 -2 -3 -4 -5",
        expectedOutput: "-1",
      },
      {
        input: "8\n-2 -3 4 -1 -2 1 5 -3",
        expectedOutput: "7",
      },
    ],
    starterTemplates: {
      c: `#include <stdio.h>

long long max(long long a, long long b) { return a > b ? a : b; }

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;

    long long current_sum, max_sum;
    long long first;
    scanf("%lld", &first);
    current_sum = max_sum = first;

    for (int i = 1; i < n; i++) {
        long long val;
        scanf("%lld", &val);
        current_sum = max(val, current_sum + val);
        max_sum = max(max_sum, current_sum);
    }

    printf("%lld\\n", max_sum);
    return 0;
}
`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;

    vector<long long> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    long long max_sum = nums[0];
    long long curr_sum = nums[0];

    for (size_t i = 1; i < nums.size(); i++) {
        curr_sum = max(nums[i], curr_sum + nums[i]);
        max_sum = max(max_sum, curr_sum);
    }

    cout << max_sum << "\\n";
    return 0;
}
`,
      java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;

        int n = sc.nextInt();
        long[] nums = new long[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextLong();

        long maxSoFar = nums[0];
        long currMax = nums[0];

        for (int i = 1; i < n; i++) {
            currMax = Math.max(nums[i], currMax + nums[i]);
            maxSoFar = Math.max(maxSoFar, currMax);
        }

        System.out.println(maxSoFar);
    }
}
`,
      python: `import sys

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    nums = [int(x) for x in tokens[1:1+n]]

    max_so_far = nums[0]
    curr_max = nums[0]

    for x in nums[1:]:
        curr_max = max(x, curr_max + x)
        max_so_far = max(max_so_far, curr_max)

    print(max_so_far)

if __name__ == "__main__":
    main()
`,
    },
  },
  {
    id: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topic: "Sliding Window & Hash Set",
    description:
      "Given a string `s`, find the length of the longest substring without repeating characters.\n\nA substring is a contiguous non-empty sequence of characters within a string.",
    inputFormat: "A single line containing the string `s`.",
    outputFormat: "Print the integer length of the longest distinct substring.",
    constraints: ["0 <= s.length <= 10^5", "s consists of English letters, digits, symbols and spaces."],
    sampleTestCases: [
      {
        input: "abcabcbb",
        expectedOutput: "3",
        explanation: "The answer is 'abc', with length 3.",
      },
      {
        input: "bbbbb",
        expectedOutput: "1",
        explanation: "The answer is 'b', with length 1.",
      },
      {
        input: "pwwkew",
        expectedOutput: "3",
        explanation: "The answer is 'wke', with length 3.",
      },
    ],
    hiddenTestCases: [
      {
        input: "a",
        expectedOutput: "1",
      },
      {
        input: "abcdefghijklmnopqrstuvwxyz",
        expectedOutput: "26",
      },
      {
        input: "tmmzuxt",
        expectedOutput: "5",
      },
    ],
    starterTemplates: {
      c: `#include <stdio.h>
#include <string.h>

int lengthOfLongestSubstring(char* s) {
    int lastPos[256];
    for (int i = 0; i < 256; i++) lastPos[i] = -1;

    int maxLen = 0;
    int left = 0;
    int n = strlen(s);

    for (int right = 0; right < n; right++) {
        unsigned char c = (unsigned char)s[right];
        if (lastPos[c] >= left) {
            left = lastPos[c] + 1;
        }
        lastPos[c] = right;
        int len = right - left + 1;
        if (len > maxLen) maxLen = len;
    }
    return maxLen;
}

int main() {
    char s[100005];
    if (fgets(s, sizeof(s), stdin)) {
        s[strcspn(s, "\\r\\n")] = 0; // Strip newline
        printf("%d\\n", lengthOfLongestSubstring(s));
    }
    return 0;
}
`,
      cpp: `#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

using namespace std;

int lengthOfLongestSubstring(const string& s) {
    vector<int> lastIndex(256, -1);
    int maxLen = 0;
    int left = 0;

    for (int right = 0; right < (int)s.size(); right++) {
        unsigned char c = s[right];
        if (lastIndex[c] >= left) {
            left = lastIndex[c] + 1;
        }
        lastIndex[c] = right;
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}

int main() {
    string s;
    if (getline(cin, s)) {
        cout << lengthOfLongestSubstring(s) << "\\n";
    }
    return 0;
}
`,
      java: `import java.util.Scanner;
import java.util.HashMap;

public class Solution {
    public static int lengthOfLongestSubstring(String s) {
        HashMap<Character, Integer> map = new HashMap<>();
        int maxLen = 0;
        int left = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (map.containsKey(c) && map.get(c) >= left) {
                left = map.get(c) + 1;
            }
            map.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.hasNextLine() ? sc.nextLine() : "";
        System.out.println(lengthOfLongestSubstring(s));
    }
}
`,
      python: `import sys

def length_of_longest_substring(s: str) -> int:
    char_map = {}
    max_len = 0
    left = 0

    for right, char in enumerate(s):
        if char in char_map and char_map[char] >= left:
            left = char_map[char] + 1
        char_map[char] = right
        max_len = max(max_len, right - left + 1)

    return max_len

def main():
    line = sys.stdin.readline().rstrip("\\r\\n")
    print(length_of_longest_substring(line))

if __name__ == "__main__":
    main()
`,
    },
  },
  {
    id: "reverse-linked-list",
    title: "Reverse a Singly Linked List",
    difficulty: "Easy",
    topic: "Linked Lists & Pointer Invariants",
    description:
      "Given the head of a singly linked list represented as an array of space-separated values, reverse the list and print the reversed elements.\n\nDemonstrates pointer manipulation invariants (`prev`, `curr`, `next_node`) without memory leaks.",
    inputFormat: "First line contains N.\nSecond line contains N space-separated integers.",
    outputFormat: "Print the reversed integers separated by a space.",
    constraints: ["0 <= N <= 10^5", "-10^5 <= val <= 10^5"],
    sampleTestCases: [
      {
        input: "5\n1 2 3 4 5",
        expectedOutput: "5 4 3 2 1",
        explanation: "1 -> 2 -> 3 -> 4 -> 5 becomes 5 -> 4 -> 3 -> 2 -> 1.",
      },
      {
        input: "2\n1 2",
        expectedOutput: "2 1",
        explanation: "1 -> 2 becomes 2 -> 1.",
      },
    ],
    hiddenTestCases: [
      {
        input: "1\n42",
        expectedOutput: "42",
      },
      {
        input: "4\n10 20 30 40",
        expectedOutput: "40 30 20 10",
      },
    ],
    starterTemplates: {
      c: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int val;
    struct Node* next;
} Node;

Node* reverseList(Node* head) {
    Node* prev = NULL;
    Node* curr = head;
    while (curr != NULL) {
        Node* nextTemp = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}

int main() {
    int n;
    if (scanf("%d", &n) != 1 || n <= 0) return 0;

    Node* head = NULL;
    Node* tail = NULL;

    for (int i = 0; i < n; i++) {
        int v;
        scanf("%d", &v);
        Node* newNode = (Node*)malloc(sizeof(Node));
        newNode->val = v;
        newNode->next = NULL;
        if (!head) head = tail = newNode;
        else { tail->next = newNode; tail = newNode; }
    }

    head = reverseList(head);
    Node* curr = head;
    while (curr) {
        printf("%d%s", curr->val, curr->next ? " " : "\\n");
        Node* temp = curr;
        curr = curr->next;
        free(temp);
    }
    return 0;
}
`,
      cpp: `#include <iostream>
#include <vector>

using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr != nullptr) {
        ListNode* nextNode = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextNode;
    }
    return prev;
}

int main() {
    int n;
    if (!(cin >> n) || n <= 0) return 0;

    ListNode* head = nullptr;
    ListNode* tail = nullptr;

    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        ListNode* node = new ListNode(x);
        if (!head) head = tail = node;
        else { tail->next = node; tail = node; }
    }

    head = reverseList(head);
    ListNode* curr = head;
    while (curr) {
        cout << curr->val << (curr->next ? " " : "\\n");
        curr = curr->next;
    }
    return 0;
}
`,
      java: `import java.util.Scanner;

class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

public class Solution {
    public static ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode nextTemp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextTemp;
        }
        return prev;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;

        int n = sc.nextInt();
        ListNode head = null, tail = null;

        for (int i = 0; i < n; i++) {
            int v = sc.nextInt();
            ListNode node = new ListNode(v);
            if (head == null) head = tail = node;
            else { tail.next = node; tail = node; }
        }

        head = reverseList(head);
        ListNode curr = head;
        while (curr != null) {
            System.out.print(curr.val + (curr.next != null ? " " : "\\n"));
            curr = curr.next;
        }
    }
}
`,
      python: `import sys

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    vals = [int(x) for x in tokens[1:1+n]]
    
    if not vals:
        return

    head = ListNode(vals[0])
    curr = head
    for v in vals[1:]:
        curr.next = ListNode(v)
        curr = curr.next

    new_head = reverse_list(head)
    res = []
    curr = new_head
    while curr:
        res.append(str(curr.val))
        curr = curr.next
    print(" ".join(res))

if __name__ == "__main__":
    main()
`,
    },
  },
  {
    id: "coin-change",
    title: "Coin Change (Fewest Coins DP)",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    description:
      "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.\n\nYou may assume that you have an infinite number of each kind of coin.",
    inputFormat: "First line contains N and amount.\nSecond line contains N distinct coin denominations.",
    outputFormat: "Print the minimum number of coins, or -1.",
    constraints: ["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"],
    sampleTestCases: [
      {
        input: "3 11\n1 2 5",
        expectedOutput: "3",
        explanation: "11 = 5 + 5 + 1 (3 coins).",
      },
      {
        input: "1 3\n2",
        expectedOutput: "-1",
        explanation: "Cannot make 3 using only 2s.",
      },
      {
        input: "1 0\n1",
        expectedOutput: "0",
        explanation: "0 amount requires 0 coins.",
      },
    ],
    hiddenTestCases: [
      {
        input: "4 6249\n186 419 83 408",
        expectedOutput: "20",
      },
      {
        input: "2 7\n2 4",
        expectedOutput: "-1",
      },
    ],
    starterTemplates: {
      c: `#include <stdio.h>
#include <stdlib.h>

int min(int a, int b) { return a < b ? a : b; }

int main() {
    int n, amount;
    if (scanf("%d %d", &n, &amount) != 2) return 0;

    int coins[20];
    for (int i = 0; i < n; i++) scanf("%d", &coins[i]);

    int* dp = (int*)malloc(sizeof(int) * (amount + 1));
    for (int i = 0; i <= amount; i++) dp[i] = amount + 1;
    dp[0] = 0;

    for (int i = 1; i <= amount; i++) {
        for (int j = 0; j < n; j++) {
            if (coins[j] <= i) {
                dp[i] = min(dp[i], dp[i - coins[j]] + 1);
            }
        }
    }

    printf("%d\\n", dp[amount] > amount ? -1 : dp[amount]);
    free(dp);
    return 0;
}
`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    int n, amount;
    if (!(cin >> n >> amount)) return 0;

    vector<int> coins(n);
    for (int i = 0; i < n; i++) cin >> coins[i];

    vector<int> dp(amount + 1, amount + 1);
    dp[0] = 0;

    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (coin <= i) {
                dp[i] = min(dp[i], dp[i - coin] + 1);
            }
        }
    }

    cout << (dp[amount] > amount ? -1 : dp[amount]) << "\\n";
    return 0;
}
`,
      java: `import java.util.Scanner;
import java.util.Arrays;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;

        int n = sc.nextInt();
        int amount = sc.nextInt();
        int[] coins = new int[n];
        for (int i = 0; i < n; i++) coins[i] = sc.nextInt();

        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;

        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (coin <= i) {
                    dp[i] = Math.min(dp[i], dp[i - coin] + 1);
                }
            }
        }

        System.out.println(dp[amount] > amount ? -1 : dp[amount]);
    }
}
`,
      python: `import sys

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    amount = int(tokens[1])
    coins = [int(x) for x in tokens[2:2+n]]

    dp = [amount + 1] * (amount + 1)
    dp[0] = 0

    for i in range(1, amount + 1):
        for c in coins:
            if c <= i:
                dp[i] = min(dp[i], dp[i - c] + 1)

    print(-1 if dp[amount] > amount else dp[amount])

if __name__ == "__main__":
    main()
`,
    },
  },
  {
    id: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy & Sell Stock",
    difficulty: "Easy",
    topic: "Greedy & Prefix Minimum",
    description:
      "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`-th day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.",
    inputFormat: "First line contains N.\nSecond line contains N space-separated integers representing prices.",
    outputFormat: "Print the maximum profit achievable (or 0).",
    constraints: ["1 <= N <= 10^5", "0 <= prices[i] <= 10^4"],
    sampleTestCases: [
      {
        input: "6\n7 1 5 3 6 4",
        expectedOutput: "5",
        explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.",
      },
      {
        input: "5\n7 6 4 3 1",
        expectedOutput: "0",
        explanation: "Prices decline strictly; no profitable transaction is possible.",
      },
    ],
    hiddenTestCases: [
      {
        input: "1\n10",
        expectedOutput: "0",
      },
      {
        input: "6\n2 4 1 7 5 9",
        expectedOutput: "8",
      },
    ],
    starterTemplates: {
      c: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1 || n <= 0) return 0;

    long long minPrice = 1000000000LL;
    long long maxProfit = 0;

    for (int i = 0; i < n; i++) {
        long long p;
        scanf("%lld", &p);
        if (p < minPrice) minPrice = p;
        else if (p - minPrice > maxProfit) maxProfit = p - minPrice;
    }

    printf("%lld\\n", maxProfit);
    return 0;
}
`,
      cpp: `#include <iostream>
#include <algorithm>
#include <climits>

using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;

    long long minPrice = LLONG_MAX;
    long long maxProfit = 0;

    for (int i = 0; i < n; i++) {
        long long p;
        cin >> p;
        minPrice = min(minPrice, p);
        maxProfit = max(maxProfit, p - minPrice);
    }

    cout << maxProfit << "\\n";
    return 0;
}
`,
      java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;

        int n = sc.nextInt();
        long minPrice = Long.MAX_VALUE;
        long maxProfit = 0;

        for (int i = 0; i < n; i++) {
            long p = sc.nextLong();
            if (p < minPrice) minPrice = p;
            else maxProfit = Math.max(maxProfit, p - minPrice);
        }

        System.out.println(maxProfit);
    }
}
`,
      python: `import sys

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    prices = [int(x) for x in tokens[1:1 + n]]

    min_price = float("inf")
    max_profit = 0
    for p in prices:
        if p < min_price:
            min_price = p
        else:
            max_profit = max(max_profit, p - min_price)

    print(max_profit)

if __name__ == "__main__":
    main()
`,
    },
  },
  {
    id: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "Easy",
    topic: "Arrays & Hash Set",
    description:
      "Given an integer array `nums`, print `true` if any value appears at least twice in the array, and print `false` if every element is distinct.",
    inputFormat: "First line contains N.\nSecond line contains N space-separated integers.",
    outputFormat: "Print 'true' or 'false'.",
    constraints: ["1 <= N <= 10^5", "-10^9 <= nums[i] <= 10^9"],
    sampleTestCases: [
      {
        input: "4\n1 2 3 1",
        expectedOutput: "true",
        explanation: "The value 1 appears at indices 0 and 3.",
      },
      {
        input: "4\n1 2 3 4",
        expectedOutput: "false",
        explanation: "All elements are distinct.",
      },
    ],
    hiddenTestCases: [
      {
        input: "1\n42",
        expectedOutput: "false",
      },
      {
        input: "10\n1 1 1 3 3 4 3 2 4 2",
        expectedOutput: "true",
      },
    ],
    starterTemplates: {
      c: `#include <stdio.h>
#include <stdlib.h>

int cmpLL(const void* a, const void* b) {
    long long x = *(const long long*)a;
    long long y = *(const long long*)b;
    return (x > y) - (x < y);
}

int main() {
    int n;
    if (scanf("%d", &n) != 1 || n <= 0) return 0;

    long long* nums = (long long*)malloc(sizeof(long long) * n);
    for (int i = 0; i < n; i++) scanf("%lld", &nums[i]);

    qsort(nums, n, sizeof(long long), cmpLL);
    int dup = 0;
    for (int i = 1; i < n; i++) {
        if (nums[i] == nums[i - 1]) {
            dup = 1;
            break;
        }
    }

    printf("%s\\n", dup ? "true" : "false");
    free(nums);
    return 0;
}
`,
      cpp: `#include <iostream>
#include <unordered_set>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;

    unordered_set<long long> seen;
    bool dup = false;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        if (!seen.insert(x).second) {
            dup = true;
        }
    }

    cout << (dup ? "true" : "false") << "\\n";
    return 0;
}
`,
      java: `import java.util.HashSet;
import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;

        int n = sc.nextInt();
        HashSet<Long> seen = new HashSet<>();
        boolean dup = false;

        for (int i = 0; i < n; i++) {
            long x = sc.nextLong();
            if (!seen.add(x)) {
                dup = true;
            }
        }

        System.out.println(dup ? "true" : "false");
    }
}
`,
      python: `import sys

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    nums = tokens[1:1 + n]
    print("true" if len(set(nums)) < len(nums) else "false")

if __name__ == "__main__":
    main()
`,
    },
  },
  {
    id: "binary-search",
    title: "Binary Search (Sorted Array Lookup)",
    difficulty: "Easy",
    topic: "Binary Search & Divide-and-Conquer",
    description:
      "Given an array of integers `nums` sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, print its 0-based index. Otherwise, print `-1`.\n\nYou must write an algorithm with O(log N) runtime complexity.",
    inputFormat: "First line contains N and target.\nSecond line contains N sorted space-separated integers.",
    outputFormat: "Print the 0-based index of target, or -1 if absent.",
    constraints: ["1 <= N <= 10^5", "-10^9 <= nums[i], target <= 10^9", "All elements in nums are unique and sorted ascending."],
    sampleTestCases: [
      {
        input: "6 9\n-1 0 3 5 9 12",
        expectedOutput: "4",
        explanation: "9 exists in nums and its 0-based index is 4.",
      },
      {
        input: "6 2\n-1 0 3 5 9 12",
        expectedOutput: "-1",
        explanation: "2 does not exist in nums so return -1.",
      },
    ],
    hiddenTestCases: [
      {
        input: "1 5\n5",
        expectedOutput: "0",
      },
      {
        input: "5 -3\n-5 -3 0 4 10",
        expectedOutput: "1",
      },
    ],
    starterTemplates: {
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    long long target;
    if (scanf("%d %lld", &n, &target) != 2) return 0;

    long long* nums = (long long*)malloc(sizeof(long long) * n);
    for (int i = 0; i < n; i++) scanf("%lld", &nums[i]);

    int left = 0, right = n - 1, ans = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            ans = mid;
            break;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    printf("%d\\n", ans);
    free(nums);
    return 0;
}
`,
      cpp: `#include <iostream>
#include <vector>

using namespace std;

int main() {
    int n;
    long long target;
    if (!(cin >> n >> target)) return 0;

    vector<long long> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    int left = 0, right = n - 1, ans = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            ans = mid;
            break;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    cout << ans << "\\n";
    return 0;
}
`,
      java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;

        int n = sc.nextInt();
        long target = sc.nextLong();
        long[] nums = new long[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextLong();

        int left = 0, right = n - 1, ans = -1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) {
                ans = mid;
                break;
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        System.out.println(ans);
    }
}
`,
      python: `import sys

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    target = int(tokens[1])
    nums = [int(x) for x in tokens[2:2 + n]]

    left, right = 0, n - 1
    ans = -1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            ans = mid
            break
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    print(ans)

if __name__ == "__main__":
    main()
`,
    },
  },
  {
    id: "merge-sorted-array",
    title: "Merge Two Sorted Arrays",
    difficulty: "Easy",
    topic: "Two Pointers",
    description:
      "You are given two sorted integer arrays `nums1` of size `M` and `nums2` of size `N`, each sorted in non-decreasing order.\n\nMerge `nums1` and `nums2` into a single array sorted in non-decreasing order in O(M + N) linear time using Two Pointers, and print the merged elements separated by spaces.",
    inputFormat:
      "First line contains M and N.\nSecond line contains M sorted integers for nums1.\nThird line contains N sorted integers for nums2.",
    outputFormat: "Print the M + N merged elements in non-decreasing order separated by spaces.",
    constraints: ["0 <= M, N <= 10^5", "M + N >= 1", "-10^9 <= nums1[i], nums2[j] <= 10^9"],
    sampleTestCases: [
      {
        input: "3 3\n1 2 3\n2 5 6",
        expectedOutput: "1 2 2 3 5 6",
        explanation: "Merging [1,2,3] and [2,5,6] produces [1,2,2,3,5,6].",
      },
      {
        input: "1 0\n1\n",
        expectedOutput: "1",
        explanation: "Second array is empty; output is 1.",
      },
    ],
    hiddenTestCases: [
      {
        input: "0 2\n\n-5 10",
        expectedOutput: "-5 10",
      },
      {
        input: "4 4\n-4 0 3 9\n-2 1 3 12",
        expectedOutput: "-4 -2 0 1 3 3 9 12",
      },
    ],
    starterTemplates: {
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int m, n;
    if (scanf("%d %d", &m, &n) != 2) return 0;

    long long* a = (long long*)malloc(sizeof(long long) * (m > 0 ? m : 1));
    long long* b = (long long*)malloc(sizeof(long long) * (n > 0 ? n : 1));

    for (int i = 0; i < m; i++) scanf("%lld", &a[i]);
    for (int j = 0; j < n; j++) scanf("%lld", &b[j]);

    int i = 0, j = 0, first = 1;
    while (i < m && j < n) {
        long long val = (a[i] <= b[j]) ? a[i++] : b[j++];
        printf("%s%lld", first ? "" : " ", val);
        first = 0;
    }
    while (i < m) {
        printf("%s%lld", first ? "" : " ", a[i++]);
        first = 0;
    }
    while (j < n) {
        printf("%s%lld", first ? "" : " ", b[j++]);
        first = 0;
    }
    printf("\\n");

    free(a);
    free(b);
    return 0;
}
`,
      cpp: `#include <iostream>
#include <vector>

using namespace std;

int main() {
    int m, n;
    if (!(cin >> m >> n)) return 0;

    vector<long long> a(m), b(n);
    for (int i = 0; i < m; i++) cin >> a[i];
    for (int j = 0; j < n; j++) cin >> b[j];

    vector<long long> merged;
    merged.reserve(m + n);
    int i = 0, j = 0;
    while (i < m && j < n) {
        if (a[i] <= b[j]) merged.push_back(a[i++]);
        else merged.push_back(b[j++]);
    }
    while (i < m) merged.push_back(a[i++]);
    while (j < n) merged.push_back(b[j++]);

    for (size_t k = 0; k < merged.size(); k++) {
        cout << merged[k] << (k + 1 < merged.size() ? " " : "\\n");
    }
    return 0;
}
`,
      java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;

        int m = sc.nextInt();
        int n = sc.nextInt();
        long[] a = new long[m];
        long[] b = new long[n];
        for (int i = 0; i < m; i++) a[i] = sc.nextLong();
        for (int j = 0; j < n; j++) b[j] = sc.nextLong();

        StringBuilder sb = new StringBuilder();
        int i = 0, j = 0;
        while (i < m && j < n) {
            if (sb.length() > 0) sb.append(" ");
            sb.append(a[i] <= b[j] ? a[i++] : b[j++]);
        }
        while (i < m) {
            if (sb.length() > 0) sb.append(" ");
            sb.append(a[i++]);
        }
        while (j < n) {
            if (sb.length() > 0) sb.append(" ");
            sb.append(b[j++]);
        }
        System.out.println(sb.toString());
    }
}
`,
      python: `import sys

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    m = int(tokens[0])
    n = int(tokens[1])
    a = [int(x) for x in tokens[2:2 + m]]
    b = [int(x) for x in tokens[2 + m:2 + m + n]]

    i = j = 0
    merged = []
    while i < m and j < n:
        if a[i] <= b[j]:
            merged.append(str(a[i]))
            i += 1
        else:
            merged.append(str(b[j]))
            j += 1
    while i < m:
        merged.append(str(a[i]))
        i += 1
    while j < n:
        merged.append(str(b[j]))
        j += 1

    print(" ".join(merged))

if __name__ == "__main__":
    main()
`,
    },
  },
];
